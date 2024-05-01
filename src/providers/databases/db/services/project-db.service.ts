import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseService } from 'src/providers/base.service';
import { Project } from 'src/providers/databases/db/schemas/project.schema';
import { ProjectQueryDto } from 'src/shared/dtos/queries/project-query.dto';
import { CreateProjectRequestDto } from 'src/shared/dtos/requests/project-request.dto';

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
