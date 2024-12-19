import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

const mongoose = require('mongoose');

@Injectable()
export class ProjectService {
  constructor(@Inject('PROJECT_MODEL') private projectModel: Model<any>) {}

  async addProject(projectData: any): Promise<any> {
    projectData._id = mongoose.Types.ObjectId().toString();
    const newProject = new this.projectModel(projectData);
    const project = await newProject.save();
    return project;
  }

  async projectList(data, params): Promise<any> {
    let condition :any = { userId: data.id, isDeleted: false };
    if (params.search) {
      condition = { userId: data.id, isDeleted: false, project_name: new RegExp('^' + params.search, 'i')}
    }
    const projectList:any = await this.projectModel
      .find(condition)
      .skip(params.skip)
      .limit(params.limit)
      .exec();
    let projectCount = await this.projectModel
    .countDocuments(condition)
    .exec();
    return {
      projectList,
      projectCount
    };
  }
  async deleteProject(data: any): Promise<any> {
    const result = await this.projectModel.updateOne(
      { _id: data.projectId },
      { $set: { isDeleted: true } },
    );
    return result;
  }
}
