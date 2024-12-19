import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  addProject,
  addUser,
  CONSTANT_MSG,
  deleteLicenseDto, deleteProject,
  deleteUser,
  LicenseDto,
  updateLicenseDto,
  updateUser,
} from 'common-dto';
import { AuthGuard } from '@nestjs/passport';
// import { ClientService } from '../../service/client/client.service';
import { CommonService } from 'src/service/common/common.service';
import { LicenseService } from 'src/service/licence/license.service';
import { UserService } from 'src/service/user/user.service';
import { ProjectService } from 'src/service/project/project.service';
import * as bcrypt from 'bcrypt';

@Controller('client')
export class ClientController {
  private logger = new Logger('ClientController');

  constructor(
    private commonService: CommonService,
    private licenseService: LicenseService,
    private userService: UserService,
    private projectService: ProjectService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
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

  @Post('license/add')
  @ApiOkResponse({
    description:
      '{ "licenceNo": "dffd", "startDate": "17/08/2021", "endDate": "17/08/2021",\n' +
      '"user": {\n' +
      '"firstName": "zcsdcacsacsac",\n' +
      '"lastName": "zcsacsacsac",\n' +
      '"email": "cszxzczxcda@fsd.com",\n' +
      '"password": "123456"\n' +
      '\n' +
      '} \n' +
      ' }',
  })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTags('Client')
  @ApiBody({ type: LicenseDto, required: true })
  async createLicense(@Body() licenseData: any) {
    if (licenseData && licenseData.licenceNo) {
      // return await this.clientService.addLicense(licenseData);
      // async createLicence(data): Promise<any> {
        const data = {licenseData}
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
      // }
    } else {
    }
  }////////////

  @Get('licence/list')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Fetch licence list' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTags('Client')
  async getLicenceList(@Query('filter') filter: string): Promise<any> {
    // return await this.clientService.getLicenceList(filter);
    // async getLicenceList(lotDetail): Promise<any> {
      const lotDetail = {filter}
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
    // }
  }//////////

  @Put('licence/update')
  @ApiOkResponse({
    description:
      'requestBody example :   {\n' +
      '"startDate":"17/08/2021",\n' +
      '"endDate": "17/08/2021", \n' +
      '"licenceId":"gsdjklgernkgogoi"\n' +
      '}',
  })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTags('Client')
  @ApiBody({ type: updateLicenseDto, required: true })
  async updateLicense(@Body() licenseData: any) {
    if (licenseData && licenseData.licenceId) {
      console.log(licenseData);
      // return await this.clientService.updateLicense(licenseData);
      // async updateLicense(data): Promise<any> {
        const data = {licenseData}
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
      // }
    
    } else {
    }
  }//////////////

  @Delete('licence/delete')
  @ApiOkResponse({
    description:
      'requestBody example :   {\n' + '"licenceId":"gsdjklgernkgogoi"\n' + '}',
  })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTags('Client')
  //@ApiBody({ type: deleteLicenseDto, required: true })
  async deleteLicense(@Query('licenceId') licenceId: any) {
    const licenseData: any = {};
    licenseData.licenceId = licenceId;
    if (licenseData.licenceId) {
      // return await this.clientService.deleteLicense(licenseData);
      // async deleteLicense(data): Promise<any> {
      const data = {licenseData}
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
      // }
    } else {
    }
  }/////////////

  @Get('users/list')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Fetch users list' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTags('Users')
  async getUsersList(@Query('filter') filter: string): Promise<any> {
    // return await this.clientService.getUsersList(filter);
    // async getUsersList(userDetail): Promise<any> {
      const userDetail = {filter}
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
    // }
  }////////////

  @Post('users/add')
  @ApiOkResponse({
    description:
      'requestBody example :   {\n' +
      '"firstName":"geno",\n' +
      '"lastName": "Typing", \n' +
      '"email":"test@genotype",\n' +
      '"password": "123456", \n' +
      '"licenceId":"gsdjklgernkgogoi"\n' +
      '}',
  })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTags('Users')
  @ApiBody({ type: addUser, required: true })
  async createUser(@Body() userData: any) {
    if (userData && userData.licenceId) {
      console.log(userData);
      // return await this.clientService.addUser(userData);
      // async createUser(data): Promise<any> {
        const data = {userData}
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
      // }
    } else {
    }
  }////////////

  @Put('users/update')
  @ApiOkResponse({
    description:
      'requestBody example :   {\n' +
      '"firstName":"geno",\n' +
      '"lastName": "Typing", \n' +
      '"email":"test@genotype",\n' +
      '"userId":"gsdjklgernkgogoi"\n' +
      '}',
  })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTags('Users')
  @ApiBody({ type: updateUser, required: true })
  async updateUser(@Body() userData: any) {
    if (userData && userData.userId) {
      console.log(userData);
      // return await this.clientService.updateUser(userDate);
      // async updateUser(data): Promise<any> {
        const data = { userData }
        try {
          console.log('data.userData', data.userData);
          if (data.userData.userId) {
            const userData = data.userData;
            const dbEmail = await this.userService.verifyUserId(userData.userId);
            if (dbEmail.email === userData.email) {
              const userDetail = await this.userService.updateclientUserData(userData);
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
                const userDetail = await this.userService.updateclientUserData(userData);
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
      // }
    } else {
    }
  }////////////////

  @Delete('users/delete')
  @ApiOkResponse({
    description:
      'requestBody example :   {\n' + '"userId":"gsdjklgernkgogoi"\n' + '}',
  })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTags('Users')
  @ApiBody({ type: deleteUser, required: true })
  async deleteUser(@Query('userId') userId: any) {
    const UserData = {
      userId: userId,
    };
    if (UserData.userId) {
      // return await this.clientService.deleteUser(UserData);
      // async deleteUser(data): Promise<any> {
        const data  = {userData : UserData}
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
      // }
    } else {
    }
  }//////////////

  @Get('licence/detail')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Fetch licence detail' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiQuery({ name: 'licenceId' })
  @ApiTags('Client')
  async getLicenceDetail(
    @Query('licenceId') licenceId: string,
    @Request() req,
  ): Promise<any> {
    if (licenceId) {
      // return await this.clientService.getLicenceDetail(licenceId);
      // async getLicenceDetail(data): Promise<any> {
        const data = {licenceId}
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
      // }
    } else {
      return {
        message: CONSTANT_MSG.PROGRAMEE_ID_MISSING,
        code: HttpStatus.NOT_FOUND,
      };
    }
  }///////////

  @Post('project/add')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Add Project' })
  @ApiTags('Client')
  @ApiBody({ type: addProject, required: true })
  async addProject(@Request() req, @Body() project: addProject) {
    console.log(req.user);
    project.userId = req.user.id;
    console.log(project);
    this.logger.log(
      `Add Project Api -- Request Body---> ${JSON.stringify(project)}`,
    );
    // return this.clientService.addProject(project);
    // async addProject(projectData: any) {
      const projectData = project
      try {
        const project = await this.projectService.addProject(projectData);
        if (project && project._id) {
          return this.commonService.successMessage(
            project,
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
      } catch (e) {
        return this.commonService.errorMessage(
          CONSTANT_MSG.USER_NOT_FOUND,
          HttpStatus.INTERNAL_SERVER_ERROR,
          this.logger,
          e,
        );
      }
    // }
  }//////////////

  
  @Get('project/List')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Fetching Project List' })
  @ApiTags('Client')
  @ApiQuery({ name: 'filter', required: true })
  async projectList(@Request() req, @Query('filter') filter: any) {
    this.logger.log(`Get Project List  --->  ${JSON.stringify(filter)}`);
    // return this.clientService.projectList(req.user, filter);
    // async projectList(data: any) {
      const data = { user : req.user , filter }
      console.log(data);
      const params = this.commonService.makeListParams(data.filter);
      console.log(params);
      const list = await this.projectService.projectList(data.user,params);
      if (list) {
        return this.commonService.successMessage(
          list,
          CONSTANT_MSG.LIST_OK,
          HttpStatus.OK,
        );
      } else {
        return this.commonService.successMessage(
          CONSTANT_MSG.INVALID_REQUEST,
          HttpStatus.INTERNAL_SERVER_ERROR,
          this.logger,
        );
      }
    // }
  }///////////////


  @Delete('project/delete')
  @ApiOkResponse({
    description:
      'requestBody example :   {\n' + '"projectId":"gsdjklgernkgogoi"\n' + '}',
  })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTags('Client')
  @ApiBody({ type: deleteProject, required: true })
  async deleteProject(@Query('projectId') projectId: any) {
    const projectData = {
      projectId: projectId,
    };
    this.logger.log(
      `Delete Project Api ---> Request Body-- ${JSON.stringify(deleteProject)}`,
    );
    if (projectData.projectId) {
      // return this.clientService.deleteProject(projectData);
      // async deleteProject(data: any) {
        const data = projectData
        try {
          if (data.projectId) {
            const project = await this.projectService.deleteProject(data);
            return this.commonService.successMessage(
              project,
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
      // }
    } else {
      console.log(projectData);
    }
  }
}
