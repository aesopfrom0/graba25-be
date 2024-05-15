import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseService } from '@graba25-be/providers/base.service';
import { Project } from '@graba25-be/providers/databases/db/schemas/project.schema';
import { ProjectQueryDto } from '@graba25-be/shared/dtos/queries/project-query.dto';
import { CreateProjectRequestDto } from '@graba25-be/shared/dtos/requests/project-request.dto';

export class ProjectDbService extends BaseService {
  constructor(@InjectModel('Project') private readonly projectModel: mongoose.Model<Project>) {
    super();
  }

  async createProject(dto: CreateProjectRequestDto): Promise<Project> {
    const project = new this.projectModel(dto);
    return await project.save();
  }

  async updateProject(id: string, dto: CreateProjectRequestDto): Promise<Project | null> {
    return await this.projectModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async readProject(id: string): Promise<Project | null> {
    return await this.projectModel.findById(id);
  }

  async readProjects(queryDto?: ProjectQueryDto): Promise<Project[]> {
    return await this.projectModel.find(queryDto ? queryDto : {});
  }
}
