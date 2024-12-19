import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Response,
  Put,
  Logger,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
// import { AuthService } from '../../service/auth/auth.service';
import {
  AdminDto,
  CONSTANT_MSG,
  AdminLoginDto,
  LicenceVerify,
} from 'common-dto';
import { AuthGuard } from '@nestjs/passport';
import { CommonService } from '../../service/common/common.service';
import { UserService } from '../../service/user/user.service';
import * as bcrypt from 'bcrypt';
import { LicenseService } from 'src/service/licence/license.service';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(
    private userService: UserService,
    private commonService: CommonService,
    private licenseService: LicenseService,
  ) {}

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  @Post('createAdmin')
  @ApiOkResponse({
    description: 'Created new admin user',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTags('Auth')
  @ApiBody({ type: AdminDto, required: true })
  async createUser(@Body() userDetail: any) {
    if (userDetail) {
      console.log('admin detail', userDetail);
      //return await this.authService.createAdminUser(userDetail);
      // async createAdminUser(userDetail): Promise<any> {
        try {
          if (userDetail.adminDetail && userDetail.adminDetail.email) {
            const user = await this.userService.findOne(userDetail.adminDetail.email);
            if (user) {
              return this.commonService.successMessage(
                {},
                CONSTANT_MSG.EMAIL_ALREADY_EXIST,
                HttpStatus.BAD_REQUEST,
              );
            }
            const salt = await bcrypt.genSalt();
            userDetail.adminDetail.password = await this.hashPassword(
              userDetail.adminDetail.password,
              salt,
            );
            userDetail.adminDetail.salt = salt;
            const newUser = await this.userService.createUser(userDetail.adminDetail);
          }
        } catch (e) {
          return this.commonService.errorMessage(
            CONSTANT_MSG.USER_NOT_FOUND,
            HttpStatus.INTERNAL_SERVER_ERROR,
            this.logger,
            e,
          );
        }
      // }
    }
    return CONSTANT_MSG.INVALID_REQUEST;
  }
  
  @Post('adminLogin')
  @ApiOkResponse({
    description:
      'requestBody example :   {\n' +
      '"email":"test@admin.com",\n' +
      '"password": "123456" \n' +
      '}',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: AdminLoginDto })
  @ApiTags('Auth')
  async doctorsLogin(@Body() loginDto: AdminLoginDto) {
    if (!loginDto.email) {
      console.log('Provide email');
      return { statusCode: HttpStatus.BAD_REQUEST, message: 'Provide email' };
    } else if (!loginDto.password) {
      console.log('Provide password');
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Provide password',
      };
    }
    //const adminUser: any = await this.authService.adminLogin(loginDto);
    //async adminLogin(adminLoginDto: any): Promise<any> {
    const { email, password } = loginDto//adminLoginDto.loginDetail;
    console.log('detail', email, password, loginDto);
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
  // }
    //return adminUser;
  }

  @Post('userLogin')
  @ApiOkResponse({
    description:
      'requestBody example :   {\n' +
      '"email":"test@genotype",\n' +
      '"password": "123456" \n' +
      '}',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: AdminLoginDto })
  @ApiTags('Auth')
  async userLogin(@Body() loginDto: AdminLoginDto) {
    if (!loginDto.email) {
      console.log('Provide email');
      return { statusCode: HttpStatus.BAD_REQUEST, message: 'Provide email' };
    } else if (!loginDto.password) {
      console.log('Provide password');
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Provide password',
      };
    }
    // const user: any = await this.authService.userLogin(loginDto);
    // return user;
    // async userLogin(loginDto: any): Promise<any> {
      const { email, password } = loginDto;
      console.log('detail', email, password, loginDto);
      const userDetails = await this.userService.user_login(email, password);
      if (!userDetails) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: CONSTANT_MSG.INVALID_CREDENTIALS,
        };
      } else {
        if (
          userDetails.userDetail.licenceId != loginDto.licenceId
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
          loginDto,
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
    // }
  }

  @Put('change_user_password')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOkResponse({
    description:
      '{"oldPassword":"123456","newPassword":"654321","confirmPassword":"654321"}',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: AdminLoginDto })
  async usersChangePassword(@Request() req, @Body() userDto: any) {
    userDto.email = req.user.email;
    if (!userDto.oldPassword) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'PLEASE_PROVIDE_OLD_PASSWORD',
      };
    } else if (!userDto.newPassword) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'PLEASE_PROVIDE_NEW_PASSWORD',
      };
    }
    // return this.authService.usersChangePassword(userDto);
    // async changePasswordUsers(userDetails: any) {
      console.log(userDto);
      try {
        const salt = await bcrypt.genSalt();
        if (userDto.email) {
          const dbEmail = await this.userService.findUser(userDto.email);
          console.log(dbEmail.password, userDto.oldPassword);
          const checkPassword = await this.userService.validatePassword(
            userDto.oldPassword,
            dbEmail.password,
          );
          console.log(checkPassword);
          if (dbEmail) {
            if (checkPassword) {
              console.log('true');
              userDto.password = await this.hashPassword(
                userDto.newPassword,
                salt,
              );
              userDto.salt = salt;
              const userDetail = await this.userService.updateUserData(
                userDto,
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
    // }
  }

  @Get('logout')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'logOut API' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async logOut(@Request() req, @Response() res) {
    if (req.user.email) {
      req.logOut();
    }
    return res.json({ message: 'sucessfully loggedout' });
  }

  @Post('licenceVerification')
  @ApiOkResponse({ description: 'Licence Verification API' })
  @ApiBody({ type: LicenceVerify })
  @ApiTags('Auth')
  async licenceVerification(@Request() req, @Body() verify: LicenceVerify) {
    console.log(verify);
    this.logger.log(
      ` License Verification API -- Request Body ---> ${JSON.stringify(
        verify,
      )}`,
    );
    // return this.authService.licenceVerification(verify);
    // async licenseVerification(licenceData: any) {
      const verified = await this.licenseService.licenseVerification(verify);
      return verified;
    // }
  }

  @Get('deviceVerification')
  @ApiOkResponse({ description: 'Fetch users list' })
  @ApiTags('Auth')
  async getUsersList(@Query('deviceId') deviceId: string): Promise<any> {
    if (deviceId) {
      // return await this.authService.deviceVerification(deviceId);
      // async deviceVerification(deviceId: any) {
        const verify = await this.licenseService.deviceVerfication(deviceId);
        return verify;
      // }
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Device Id Not Found',
      };
    }
  }

  @Get('adminDetails')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'User API' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTags('Auth')
  async getUser(@Request() req) {
    this.logger.log(
      ` Admin details API -- Request Body ---> ${JSON.stringify(req.user)}`,
    );
    // return await this.authService.getUser(req.user);
    // async getAdminDetails(data: any) {
      try {
        const userDetail = await this.userService.getAdminDetails(req.user);
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
    // }
  }
}
