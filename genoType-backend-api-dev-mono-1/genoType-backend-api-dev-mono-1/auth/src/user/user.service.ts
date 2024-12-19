import { Inject, Injectable, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { CommonService } from '../services/common/common.service';
import { AdminUsers, Licence, Users } from 'common-dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject('ADMIN_USER_MODEL') private adminUserModel: Model<AdminUsers>,
    @Inject('USER_MODEL') private usersModel: Model<Users>,
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
}
