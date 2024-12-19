import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { ProjectService } from './project.service';
import { MessagePattern } from '@nestjs/microservices';
import { CONSTANT_MSG } from 'common-dto';
import { CommonService } from '../services/common/common.service';

@Controller('project')
export class ProjectController {
  private logger = new Logger('ProjectController');
  constructor(
    private projectService: ProjectService,
    private commonService: CommonService,
  ) {}

  @MessagePattern({ cmd: 'add_project' })
  async addProject(projectData: any) {
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
  }

  @MessagePattern({ cmd: 'project_list' })
  async projectList(data: any) {
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
  }

  @MessagePattern({ cmd: 'delete_project' })
  async deleteProject(data: any) {
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
  }
}
