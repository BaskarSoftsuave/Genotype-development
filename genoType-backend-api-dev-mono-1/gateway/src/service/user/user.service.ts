import { Inject, Injectable, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { CommonService } from '../common/common.service';
import { AdminUsers, Licence, Users } from 'common-dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const mongoose = require('mongoose');

@Injectable()
export class UserService {
  constructor(
    @Inject('ADMIN_USER_MODEL') private adminUserModel: Model<AdminUsers>,
    @Inject('USERS_MODEL') private usersModel: Model<any>,
    @Inject('LICENCE_MODEL') private licenseModel: Model<Licence>,
    private commonService: CommonService,
    private readonly jwtService: JwtService,
  ) {}
  async validatePassword(password: string, nP: string): Promise<boolean> {
    return await bcrypt.compare(password, nP);
  }
  async findOne(email: string): Promise<any> {
    const userData: any = await this.adminUserModel.findOne({ email }).exec();
    return userData;
  }

  async findUser(email: string): Promise<any> {
    const userData: any = await this.usersModel.findOne({ email,isDeleted:false }).exec();
    return userData;
  }
  async createUser(userDetail: any): Promise<any> {
    const newUser = new this.adminUserModel(userDetail);
    await newUser.save();
    return newUser;
  }
  async admin_Login(email: any, password: any): Promise<any> {
    console.log(email, password);
    const loginUser = await this.adminUserModel
      .aggregate([
        { $match: { email: email } },
        {
          $project: {
            password: 1,
            email: 1,
            salt: 1,
          },
        },
      ])
      .exec();
    if (loginUser && loginUser.length) {
      const userDetail = loginUser[0];
      if (userDetail.email) {
        const payload: any = {
          email: userDetail.email,
          firstName: userDetail.firstName,
          id: userDetail._id,
          role: 'ADMIN',
        };
        let accessToken = null;
        if (await this.validatePassword(password, userDetail.password)) {
          accessToken = this.jwtService.sign(payload);
        } else {
          return null;
        }
        return { userDetail, accessToken };
      } else {
        return null;
      }
    }
    return null;
  }

  async user_login(email: any, password: any): Promise<any> {
    console.log(email, password);
    const loginUser = await this.usersModel
      .aggregate([
        { $match: { email: email } },
        {
          $project: {
            password: 1,
            email: 1,
            salt: 1,
            firstName: 1,
            lastName: 1,
            licenceId: 1,
            isDeleted: 1,
          },
        },
      ])
      .exec();
    if (loginUser && loginUser.length && loginUser[0].isDeleted === false) {
      const userDetail = loginUser[0];
      if (userDetail.email) {
        const payload: any = {
          email: userDetail.email,
          firstName: userDetail.firstName,
          lastName: userDetail.lastName,
          licenceId: userDetail.licenceId,
          id: userDetail._id,
          role: 'USERS',
        };
        let accessToken = null;
        if (await this.validatePassword(password, userDetail.password)) {
          accessToken = this.jwtService.sign(payload);
        } else {
          return null;
        }
        return { userDetail, accessToken };
      } else {
        return null;
      }
    }
    return null;
  }

  async updateUserData(userData): Promise<any> {
    console.log(userData);
    const result = await this.usersModel.updateOne(
      { email: userData.email },
      {
        $set: {
          password: userData.password,
          salt: userData.salt,
        },
      },
    );
    return result;
  }

  async updateLicense(loginData: any, userData: any) {
    const licence = await this.licenseModel.findOne({
      _id: loginData.licenceId,
    });
    if (licence.verifiedBy && licence.deviceId) {
      if (licence.deviceId != userData.deviceId) {
        console.log('true');
        console.log(licence.deviceId, userData.loginDetail.deviceId);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Licence Already In Use',
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'updated Successfully',
      };
    } else {
      const result = await this.licenseModel.updateOne(
        { _id: loginData.licenceId },
        {
          $set: {
            verifiedBy: loginData._id,
          },
        },
      );
    }
  }

  async licenseValidation(licenceId:string){
    const license :any = await this.licenseModel.findOne({
      _id:licenceId,
      isDeleted:false
    });
    if (!license) {
      return false;//no license
    }
    if(license.isLifeLongLicence){
      return true;
    }else{
      let expiryDate:any  = new Date(license.endDate);    
      expiryDate = expiryDate.toISOString().slice(0,10);
      let currentDate:any = new Date();
      currentDate = currentDate.toISOString().slice(0,10)
      if(expiryDate >= currentDate){
        return true;
      }else{
        return false; //expired license
      }
    }
  }

  async getAdminDetails(data: any): Promise<any> {
    const user = await this.adminUserModel
      .aggregate([
        { $match: { _id: data.id } },
        {
          $project: {
            email: 1,
            firstName: 1,
            lastName: 1,
            isDeleted: 1,
          },
        },
      ])
      .exec();
    console.log(user);
    return user;
  }
  
  public async findUserByEmail(email: string): Promise<any> {
    // async getUserDetail(email: string): Promise<any> {
      try {
        const userDetail: any = await this.findOne(email);
        return userDetail ? userDetail : null;
      } catch (e) {
        return null;
      }
    }
  // }


  //form client user service

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

  async updateclientUserData(userData): Promise<any> {// name changed from  updateUserData
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
