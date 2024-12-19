import { CommonService } from '../services/common/common.service';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

const mongoose = require('mongoose');

@Injectable()
export class UserService {
  constructor(
    @Inject('USERS_MODEL') private usersModel: Model<any>,
    @Inject('LICENCE_MODEL') private licenseModel: Model<any>,
    private commonService: CommonService,
  ) {}

  async addUsers(userData: any): Promise<any> {
    userData['_id'] = mongoose.Types.ObjectId().toString();
    const newUser = new this.usersModel(userData);
    const user = await newUser.save();
    return user;
  }

  async getUserList(userFilter) {
    const userCount = await this.userCount();
    if (userFilter.search) {
      const filteredUser = await this.usersModel
      .aggregate([
        {
          $match: {
            isDeleted: false,
            $or: [{  firstName: new RegExp('^' + userFilter.search, 'i')},
            {lastName: new RegExp('^' + userFilter.search, 'i') },
            { email: new RegExp('^' + userFilter.search, 'i')}]
          },
        },
        {
          $lookup: {
            from: 'licences',
            localField: 'licenceId',
            foreignField: '_id',
            as: 'licences',
          },
        },
        { $unwind: '$licences' },
        {
          $addFields: {
            licenceNo: '$licences.licenceNo',
            companyName: '$licences.companyName',
            userLimit: '$licences.noOfUser',
            licenceId: '$licences._id',
          },
        },
        {
          $project: {
            licenceNo: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            licenceId: 1,
            companyName: 1,
            userLimit: 1,
            _id: 1,
          },
        },

        {
          $group: {
            _id: '$licenceId',
            data: {
              $push: {
                lastName: '$lastName',
                firstName: '$firstName',
                email: '$email',
                licenceNo: '$licenceNo',
                userId: '$_id',
                licenceId: '$licenceId',
                companyName: '$companyName',
                userLimit: '$userLimit',
              },
            },
          },
        },
        { $skip: userFilter.skip },
        { $limit: userFilter.limit },
      ])
      .exec();
    console.log('filteredUser', filteredUser);
    return {
      usersList:filteredUser,
      userCount: userCount,
    };
    }
    const userDetails = await this.usersModel
      .aggregate([
        {
          $facet: {
            userList: [
              { $match: { isDeleted: false, licenceId: { $exists: true } } },
              {
                $lookup: {
                  from: 'licences',
                  localField: 'licenceId',
                  foreignField: '_id',
                  as: 'licences',
                },
              },
              { $unwind: '$licences' },
              {
                $addFields: {
                  licenceNo: '$licences.licenceNo',
                  companyName: '$licences.companyName',
                  userLimit: '$licences.noOfUser',
                  licenceId: '$licences._id',
                },
              },
              {
                $project: {
                  licenceNo: 1,
                  firstName: 1,
                  lastName: 1,
                  email: 1,
                  licenceId: 1,
                  companyName: 1,
                  userLimit: 1,
                  _id: 1,
                },
              },

              {
                $group: {
                  _id: '$licenceId',
                  data: {
                    $push: {
                      lastName: '$lastName',
                      firstName: '$firstName',
                      email: '$email',
                      licenceNo: '$licenceNo',
                      userId: '$_id',
                      licenceId: '$licenceId',
                      companyName: '$companyName',
                      userLimit: '$userLimit',
                    },
                  },
                },
              },
              { $skip: userFilter.skip },
              { $limit: userFilter.limit },
            ],
            totalCount: [
              {
                $match: { isDeleted: false, licenceId: { $exists: true } },
              },
              { $count: 'count' },
            ],
          },
        },
        { $unwind: '$totalCount' },
        { $addFields: { count: '$totalCount.count' } },
        { $project: { userList: 1, count: 1 } },
      ])
      .exec();
    console.log(userDetails[0]);
    return {
      usersList: userDetails[0] ? userDetails[0].userList : [],
      userCount: userCount,
    };
  }


  async userCount() {
    const licence = await this.licenseModel.find({isDeleted: false}).exec();
    console.log(licence.length);
    return licence ? licence.length : 0;
  }
  async updateUserId(licenceId: string, userId: string): Promise<any> {
    await this.licenseModel.updateOne(
      { _id: licenceId },
      { $addToSet: { userIds: userId } },
    );
  }

  async verifyUserEmail(email): Promise<any> {
    const result = await this.usersModel.findOne({ email: email });
    return result;
  }

  async verifyUserId(id): Promise<any> {
    const result = await this.usersModel.findOne({ _id: id });
    return result;
  }

  async updateUserData(userData): Promise<any> {
    console.log(userData);
    const result = await this.usersModel.updateOne(
      { _id: userData.userId },
      {
        $set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      },
    );
    return result;
  }

  async deleteUserData(userData): Promise<any> {
    console.log(userData);
    const result = await this.usersModel.updateOne(
      { _id: userData.userId },
      { $set: { isDeleted: true } },
    );
    return result;
  }

  async deleteUserId(data: any): Promise<any> {
    const userId = data.userId;
    const licence = await this.usersModel.findOne({ _id: userId });
    const licenceId = licence.licenceId;
    await this.licenseModel.updateOne(
      { _id: licenceId },
      { $pull: { userIds: userId } },
    );
  }
}
