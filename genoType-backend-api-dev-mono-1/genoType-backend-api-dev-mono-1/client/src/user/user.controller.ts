import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonService } from '../services/common/common.service';
import { MessagePattern } from '@nestjs/microservices';
import { CONSTANT_MSG } from 'common-dto';
import * as bcrypt from 'bcrypt';
import { LicenseService } from '../license/license.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private licenseService: LicenseService,
    private commonService: CommonService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private logger = new Logger('UserController');

  @MessagePattern({ cmd: 'get_users_list' })
  async getUsersList(userDetail): Promise<any> {
    try {
      const userFilter =
        userDetail && userDetail.filter ? userDetail.filter : '';
      const params = this.commonService.makeListParams(userFilter);
      const usersList = await this.userService.getUserList(params);
      return this.commonService.successMessage(
        usersList,
        CONSTANT_MSG.LIST_OK,
        HttpStatus.OK,
      );
    } catch (e) {
      return this.commonService.errorMessage(
        CONSTANT_MSG.USER_NOT_FOUND,
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.logger,
        e,
      );
    }
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(data): Promise<any> {
    try {
      console.log('data.userData', data.userData);
      const checkLimit = await this.checkUserLimit(data.userData.licenceId);
      if (checkLimit) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User limit exceeds',
        };
      }
      if (data.userData && data.userData.licenceId && data.userData.email) {
        const dbEmail = await this.userService.verifyUserEmail(
          data.userData.email,
        );
        console.log('Test', dbEmail);
        if (!dbEmail) {
          const userData = data.userData;
          const salt = await bcrypt.genSalt();
          userData.password = await this.hashPassword(userData.password);
          userData.salt = salt;
          const userDetail = await this.userService.addUsers(userData);
          console.log('userId', userDetail);
          if (userDetail && userDetail._id) {
            const licenceValue = await this.userService.updateUserId(
              userData.licenceId,
              userDetail._id,
            );
            return this.commonService.successMessage(
              licenceValue,
              CONSTANT_MSG.CREATE_OK,
              HttpStatus.OK,
            );
          } else {
            return this.commonService.successMessage(
              CONSTANT_MSG.INVALID_REQUEST,
              HttpStatus.INTERNAL_SERVER_ERROR,
              this.logger,
            );
          }
        } else {
          return this.commonService.successMessage(
            HttpStatus.INTERNAL_SERVER_ERROR,
            CONSTANT_MSG.EMAIL_ALREADY_EXIST,
            this.logger,
          );
        }
      } else {
        return this.commonService.successMessage(
          HttpStatus.INTERNAL_SERVER_ERROR,
          CONSTANT_MSG.INVALID_REQUEST,
          this.logger,
        );
      }
    } catch (e) {
      return this.commonService.errorMessage(
        HttpStatus.INTERNAL_SERVER_ERROR,
        CONSTANT_MSG.USER_NOT_FOUND,
        this.logger,
        e,
      );
    }
  }

  async checkUserLimit(licenseId) {
    const licenceDetails: any = await this.licenseService.getLicenceDetail(
      licenseId,
    );
    if (licenceDetails[0].noOfUser === licenceDetails[0].userIds.length) {
      console.log('true');
      return true;
    }
    return false;
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(data): Promise<any> {
    try {
      console.log('data.userData', data.userData);
      if (data.userData.userId) {
        const userData = data.userData;
        const dbEmail = await this.userService.verifyUserId(userData.userId);
        if (dbEmail.email === userData.email) {
          const userDetail = await this.userService.updateUserData(userData);
          return this.commonService.successMessage(
            userDetail,
            CONSTANT_MSG.UPDATE_OK,
            HttpStatus.OK,
          );
        } else {
          const verifyEmail = await this.userService.verifyUserEmail(
            userData.email,
          );
          if (!verifyEmail) {
            const userDetail = await this.userService.updateUserData(userData);
            return this.commonService.successMessage(
              userDetail,
              CONSTANT_MSG.UPDATE_OK,
              HttpStatus.OK,
            );
          } else {
            return this.commonService.successMessage(
              CONSTANT_MSG.EMAIL_ALREADY_EXIST,
              HttpStatus.INTERNAL_SERVER_ERROR,
              this.logger,
            );
          }
        }
      } else {
        return this.commonService.successMessage(
          CONSTANT_MSG.USER_NOT_FOUND,
          HttpStatus.INTERNAL_SERVER_ERROR,
          this.logger,
        );
      }
    } catch (e) {
      return this.commonService.errorMessage(
        CONSTANT_MSG.USER_NOT_FOUND,
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.logger,
        e,
      );
    }
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(data): Promise<any> {
    try {
      console.log('data.userData', data.userData);
      if (data.userData.userId) {
        const userData = data.userData;
        const userDetail = await this.userService.deleteUserData(userData);
        const licenceData = await this.userService.deleteUserId(userData);
        return this.commonService.successMessage(
          userDetail,
          CONSTANT_MSG.DELETE_OK,
          HttpStatus.OK,
        );
      } else {
        return this.commonService.successMessage(
          CONSTANT_MSG.USER_NOT_FOUND,
          HttpStatus.INTERNAL_SERVER_ERROR,
          this.logger,
        );
      }
    } catch (e) {
      return this.commonService.errorMessage(
        CONSTANT_MSG.USER_NOT_FOUND,
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.logger,
        e,
      );
    }
  }
}
