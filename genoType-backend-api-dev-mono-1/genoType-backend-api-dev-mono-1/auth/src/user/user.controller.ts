import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommonService } from '../services/common/common.service';
import { UserService } from './user.service';
import { CONSTANT_MSG } from 'common-dto';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private commonService: CommonService,
  ) {}
  private logger = new Logger('UserController');
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
  @MessagePattern({ cmd: 'create_admin_user' })
  async createAdminUser(data): Promise<any> {
    try {
      if (data.adminDetail && data.adminDetail.email) {
        const user = await this.userService.findOne(data.adminDetail.email);
        if (user) {
          return this.commonService.successMessage(
            {},
            CONSTANT_MSG.EMAIL_ALREADY_EXIST,
            HttpStatus.BAD_REQUEST,
          );
        }
        const salt = await bcrypt.genSalt();
        data.adminDetail.password = await this.hashPassword(
          data.adminDetail.password,
          salt,
        );
        data.adminDetail.salt = salt;
        const newUser = await this.userService.createUser(data.adminDetail);
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

  @MessagePattern({ cmd: 'do_admin_login' })
  async adminLogin(adminLoginDto: any): Promise<any> {
    const { email, password } = adminLoginDto.loginDetail;
    console.log('detail', email, password, adminLoginDto);
    const adminDetail = await this.userService.admin_Login(email, password);
    if (!adminDetail) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: CONSTANT_MSG.INVALID_CREDENTIALS,
      };
    } else {
      if (adminDetail && adminDetail.userDetail) {
        delete adminDetail.userDetail.password;
        delete adminDetail.userDetail.salt;
        this.logger.log(
          `User Login  Api -> Response ${JSON.stringify(adminDetail)}`,
        );
        return this.commonService.successMessage(
          adminDetail,
          CONSTANT_MSG.LOGIN_SUCCESS,
          HttpStatus.OK,
        );
      } else {
        return this.commonService.successMessage(
          adminDetail,
          CONSTANT_MSG.USER_NOT_FOUND,
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
  @MessagePattern({ cmd: 'auth_user_find_by_email' })
  async getUserDetail(email: string): Promise<any> {
    try {
      const userDetail: any = await this.userService.findOne(email);
      return userDetail ? userDetail : null;
    } catch (e) {
      return null;
    }
  }

  @MessagePattern({ cmd: 'user_by_email' })
  async getUserByEmail(email: string): Promise<any> {
    try {
      const user: any = await this.userService.findUser(email);
      return user ? user : null;
    } catch (e) {
      return null;
    }
  }

  @MessagePattern({ cmd: 'do_user_login' })
  async userLogin(userLoginDto: any): Promise<any> {
    const { email, password } = userLoginDto.loginDetail;
    console.log('detail', email, password, userLoginDto);
    const userDetails = await this.userService.user_login(email, password);
    if (!userDetails) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: CONSTANT_MSG.INVALID_CREDENTIALS,
      };
    } else {
      if (
        userDetails.userDetail.licenceId != userLoginDto.loginDetail.licenceId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: CONSTANT_MSG.INVALID_CREDENTIALS,
        };
      }

      if(!(await this.userService.licenseValidation(userDetails.userDetail.licenceId))){
        return {
          statusCode: HttpStatus.GONE,
          message: 'License Expired',
        };
      }
      const update = await this.userService.updateLicense(
        userDetails.userDetail,
        userLoginDto.loginDetail,
      );
      if (update.statusCode != 200) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'License is already in use',
        };
      }
      if (userDetails && userDetails.userDetail) {
        delete userDetails.userDetail.password;
        delete userDetails.userDetail.salt;
        this.logger.log(
          `User Login  Api -> Response ${JSON.stringify(userDetails)}`,
        );
        return this.commonService.successMessage(
          userDetails,
          CONSTANT_MSG.LOGIN_SUCCESS,
          HttpStatus.OK,
        );
      } else {
        return this.commonService.successMessage(
          userDetails,
          CONSTANT_MSG.USER_NOT_FOUND,
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
  @MessagePattern({ cmd: 'users_change_password' })
  async changePasswordUsers(userDetails: any) {
    console.log(userDetails);
    try {
      const salt = await bcrypt.genSalt();
      if (userDetails.email) {
        const dbEmail = await this.userService.findUser(userDetails.email);
        console.log(dbEmail.password, userDetails.oldPassword);
        const checkPassword = await this.userService.validatePassword(
          userDetails.oldPassword,
          dbEmail.password,
        );
        console.log(checkPassword);
        if (dbEmail) {
          if (checkPassword) {
            console.log('true');
            userDetails.password = await this.hashPassword(
              userDetails.newPassword,
              salt,
            );
            userDetails.salt = salt;
            const userDetail = await this.userService.updateUserData(
              userDetails,
            );
            return this.commonService.successMessage(
              userDetail,
              CONSTANT_MSG.UPDATE_OK,
              HttpStatus.OK,
            );
          } else {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'INCORRECT_CURRENT_PASSWORD',
            };
          }
        } else {
          return this.commonService.successMessage(
            CONSTANT_MSG.USER_NOT_FOUND,
            HttpStatus.INTERNAL_SERVER_ERROR,
            this.logger,
          );
        }
      }
    } catch (e) {
      console.log(e);
      return this.commonService.errorMessage(
        CONSTANT_MSG.USER_NOT_FOUND,
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.logger,
        e,
      );
    }
  }

  @MessagePattern({ cmd: 'get-admin-details' })
  async getAdminDetails(data: any) {
    try {
      const userDetail = await this.userService.getAdminDetails(data);
      if (userDetail) {
        return this.commonService.successMessage(
          userDetail,
          CONSTANT_MSG.FETCH_OK,
          HttpStatus.OK,
        );
      }
    } catch (e) {
      console.log(e);
      return this.commonService.errorMessage(
        CONSTANT_MSG.USER_NOT_FOUND,
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.logger,
        e,
      );
    }
  }
}
