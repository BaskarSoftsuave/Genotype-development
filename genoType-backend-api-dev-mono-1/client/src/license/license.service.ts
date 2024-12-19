import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CommonService } from '../services/common/common.service';
const mongoose = require('mongoose');

@Injectable()
export class LicenseService {
  constructor(
    @Inject('LICENCE_MODEL') private licenseModel: Model<any>,
    @Inject('USERS_MODEL') private usersModel: Model<any>,
    private commonService: CommonService,
  ) {}

  async addLicence(licenceData: any, userId: any): Promise<any> {
    licenceData['_id'] = mongoose.Types.ObjectId().toString();
    const newUser = new this.licenseModel(licenceData);
    await newUser.save();
    await this.updateLicenceId(newUser._id, userId);
    return newUser;
  }

  async updateLicenceId(licenceId: string, userId: string): Promise<any> {
    await this.usersModel.updateOne(
      { _id: userId },
      { $set: { licenceId: licenceId } },
    );
  }

  async getLicenceList(params) {
    const condition = { isDeleted: false };
    if (params.search) {
      condition['companyName'] = new RegExp('^' + params.search, 'i');
    }
    const licenceList = await this.licenseModel
      .find(condition)
      .skip(params.skip)
      .limit(params.limit)
      .exec();
    const licenceCount = await this.licenseModel
      .countDocuments(condition)
      .exec();
    return {
      licenceList,
      licenceCount,
    };
  }

  async updateLicenseData(licenseData): Promise<any> {
    const result = await this.licenseModel.updateOne(
      { _id: licenseData.licenceId },
      {
        $set: {
          startDate: licenseData.startDate,
          endDate: licenseData.endDate,
          isLifeLongLicence:licenseData.isLifeLongLicence,
          companyName: licenseData.companyName,
          noOfUser: licenseData.noOfUser,
        },
      },
    ).exec();
    return result;
  }

  async deleteLicenseData(licenseData): Promise<any> {
    const users = await this.licenseModel
      .findOne({ _id: licenseData.licenceId })
      .exec();
    console.log(users);
    for (const user of users.userIds) {
      const result = await this.usersModel.updateOne(
        { _id: user },
        { $set: { isDeleted: true } },
      );
    }
    const result = await this.licenseModel.updateOne(
      { _id: licenseData.licenceId },
      { $set: { isDeleted: true } },
    );
    return result;
  }
  async getLicenceDetail(licenceId) {
    return this.licenseModel.aggregate([
      {
        $match: {
          isDeleted: false,
          _id: licenceId,
          licenceNo: { $exists: true },
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { userIds: '$userIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$_id', '$$userIds'] },
                    { $eq: ['$isDeleted', false] },
                  ],
                },
              },
            },
            { $project: { _id: 1, firstName: 1, lastName: 1, email: 1 } },
          ],
          as: 'users',
        },
      },
    ]);
  }

  async licenseVerification(data: any) {
    const license = await this.licenseModel.findOne({
      licenceNo: data.licenceNumber,
      isDeleted:false
    });
    if (!license) {
      return {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: 'Invalid license,Please Enter correct license number',
      };
    }

    if(!(await this.licenseValidation(license._id))){
      return {
        statusCode: HttpStatus.GONE,
        message: 'Invalid license, license is expired',
      };
    }

    if (license && license.isVerified) {
      if (license.deviceId === data.deviceId) {
        console.log(license.deviceId, data.deviceId);
        return {
          statusCode: HttpStatus.OK,
          message: 'License Already Verified',
          license,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'License Already In Use',
          license,
        };
      }
    } else {
      const update = await this.licenseModel.updateOne(
        { _id: license._id },
        {
          $set: {
            isVerified: true,
            deviceId: data.deviceId,
          },
        },
      );
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'License Verified Successfully',
      license,
    };
  }

  async licenseValidation(licenseID){
    const license = await this.licenseModel.findOne({
      _id:licenseID,
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

  async deviceVerfication(deviceId: string) {
    const license = await this.licenseModel.findOne({
      deviceId: deviceId,
      isVerified: true,
      isDeleted: false,
    });
    console.log('licence detail', license);
    if (!license) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Device Not Verified',
      };
    } else {
      return {
        statusCode: HttpStatus.OK,
        message: 'Device verified',
        license,
      };
    }
  }
}
