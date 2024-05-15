import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/providers/base.service';
import { ProjectDbService } from 'src/providers/databases/db/services/project-db.service';
import { ProjectQueryDto } from 'src/shared/dtos/queries/project-query.dto';

@Injectable()
export class ProjectsService extends BaseService {
  constructor(private readonly projectDbService: ProjectDbService) {
    super();
  }

  async getProjects(query?: ProjectQueryDto) {
    return await this.projectDbService.readProjects(query);
  }

  async getProject(id: string) {
    return await this.projectDbService.readProject(id);
  }

  async createProject(dto: any) {
    return await this.projectDbService.createProject(dto);
  }

  async updateProject(id: string, dto: any) {
    return await this.projectDbService.updateProject(id, dto);
  }
}
