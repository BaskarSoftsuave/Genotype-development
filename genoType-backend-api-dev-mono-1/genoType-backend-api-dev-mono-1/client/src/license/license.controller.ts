import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { CommonService } from '../services/common/common.service';
import { MessagePattern } from '@nestjs/microservices';
import { LicenseService } from './license.service';
import { CONSTANT_MSG } from 'common-dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Controller('license')
export class LicenseController {
  public logger = new Logger('LicenseController');

  constructor(
    private commonService: CommonService,
    private licenseService: LicenseService,
    private userService: UserService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  @MessagePattern({ cmd: 'create_license' })
  async createLicence(data): Promise<any> {
    try {
      if (data.licenseData && data.licenseData.licenceNo) {
        if (data.licenseData.user) {
          const userData = data.licenseData.user;
          const salt = await bcrypt.genSalt();
          userData.password = await this.hashPassword(userData.password);
          userData.salt = salt;
          const userDetail = await this.userService.addUsers(userData);
          if (userDetail && userDetail._id) {
            data.licenseData.userIds = [userDetail._id];
            const licenceValue = await this.licenseService.addLicence(
              data.licenseData,
              userDetail._id,
            );
            return this.commonService.successMessage(
              licenceValue,
              CONSTANT_MSG.CREATE_OK,
              HttpStatus.OK,
            );
          } else {
          }
        } else {
          return this.commonService.successMessage(
            CONSTANT_MSG.INVALID_REQUEST,
            HttpStatus.INTERNAL_SERVER_ERROR,
            this.logger,
          );
        }
      } else {
        return this.commonService.successMessage(
          CONSTANT_MSG.INVALID_REQUEST,
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

  @MessagePattern({ cmd: 'get_licence_list' })
  async getLicenceList(lotDetail): Promise<any> {
    try {
      const params = this.commonService.makeListParams(lotDetail.filter);
      const licenceList = await this.licenseService.getLicenceList(params);
      return this.commonService.successMessage(
        licenceList,
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

  @MessagePattern({ cmd: 'update_license' })
  async updateLicense(data): Promise<any> {
    try {
      console.log('data.licenseData', data.licenseData);
      if (data.licenseData.licenceId) {
        const licenseData = data.licenseData;
        const licenseDetail = await this.licenseService.updateLicenseData(
          licenseData,
        );
        return this.commonService.successMessage(
          licenseDetail,
          CONSTANT_MSG.UPDATE_OK,
          HttpStatus.OK,
        );
      } else {
        return this.commonService.successMessage(
          CONSTANT_MSG.INVALID_REQUEST,
          HttpStatus.INTERNAL_SERVER_ERROR,
          this.logger,
        );
      }
    } catch (e) {
      return this.commonService.errorMessage(
        CONSTANT_MSG.INVALID_REQUEST,
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.logger,
        e,
      );
    }
  }

  @MessagePattern({ cmd: 'delete_license' })
  async deleteLicense(data): Promise<any> {
    try {
      console.log('data.licenseData', data.licenseData);
      if (data.licenseData.licenceId) {
        const licenseData = data.licenseData;
        const licenseDetail = await this.licenseService.deleteLicenseData(
          licenseData,
        );
        return this.commonService.successMessage(
          licenseDetail,
          CONSTANT_MSG.DELETE_OK,
          HttpStatus.OK,
        );
      } else {
        return this.commonService.successMessage(
          CONSTANT_MSG.INVALID_REQUEST,
          HttpStatus.INTERNAL_SERVER_ERROR,
          this.logger,
        );
      }
    } catch (e) {
      return this.commonService.errorMessage(
        CONSTANT_MSG.INVALID_REQUEST,
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.logger,
        e,
      );
    }
  }
  @MessagePattern({ cmd: 'get_licence_detail' })
  async getLicenceDetail(data): Promise<any> {
    try {
      if (data.licenceId) {
        const licenseDetail = await this.licenseService.getLicenceDetail(
          data.licenceId,
        );
        console.log('licenseDetail', licenseDetail);
        return this.commonService.successMessage(
          licenseDetail,
          CONSTANT_MSG.UPDATE_OK,
          HttpStatus.OK,
        );
      } else {
        return this.commonService.successMessage(
          CONSTANT_MSG.INVALID_REQUEST,
          HttpStatus.INTERNAL_SERVER_ERROR,
          this.logger,
        );
      }
    } catch (e) {
      return this.commonService.errorMessage(
        CONSTANT_MSG.INVALID_REQUEST,
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.logger,
        e,
      );
    }
  }
  @MessagePattern({ cmd: 'license_verification' })
  async licenseVerification(licenceData: any) {
    const verify = await this.licenseService.licenseVerification(licenceData);
    return verify;
  }
  @MessagePattern({ cmd: 'device_verification' })
  async deviceVerification(deviceId: any) {
    const verify = await this.licenseService.deviceVerfication(deviceId);
    return verify;
  }

  @MessagePattern({ cmd: 'license_Validation' })
  async licenseValidation(licenceID: any) {
    const isValid = await this.licenseService.licenseValidation(licenceID);
    return isValid;
  }

}
