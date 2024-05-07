import { ConfigService } from '@nestjs/config';
import {
  GetTaskDto,
  BaseTaskDto,
  getCurrentTaskDto,
  UpdateTaskDto,
} from '../../../../shared/dtos/base-task.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseNotionDbService } from './base-notion-db.service';
import { isNil } from 'lodash';
import ApplicationException from '@graba25-be/shared/excenptions/application.exception';
import { ErrorCode } from '@graba25-be/shared/excenptions/error-code';

@Injectable()
export class TaskNotionDbService extends BaseNotionDbService {
  readonly #config = new ConfigService();
  readonly #dbId: string;

  constructor() {
    super();
    this.#dbId = this.#config.get('TASK_TABLE_ID') ?? '';
  }

  async getTasks(isArchived: boolean): Promise<GetTaskDto[]> {
    const resp = (
      await this.notion.databases.query({
        database_id: this.#dbId,
        sorts: [
          {
            property: 'createdAt',
            direction: 'ascending',
          },
        ],
        filter: {
          and: [
            {
              property: 'isArchived',
              checkbox: { equals: isArchived },
            },
          ],
        },
      })
    )?.results;
    const result = [] as GetTaskDto[];
    resp.forEach((task) => {
      const properties = task['properties'];
      properties &&
        result.push({
          id: task.id,
          title: properties.title.title[0]?.plain_text,
          // userId: properties.userId.number,
          memo: properties.memo?.rich_text[0]?.plain_text,
          actAttempts: properties.actAttempts.number,
          estAttempts: properties.estAttempts.number,
          isFinished: properties.isFinished.checkbox,
          isArchived: properties.isArchived.checkbox,
          isCurrentTask: properties.isCurrentTask.checkbox,
          createdAt: properties.createdAt.created_time as string,
          updatedAt: properties.updatedAt.last_edited_time,
        });
    });
    return result;
  }

  async createTask(dto: BaseTaskDto): Promise<{ pageId: string }> {
    try {
      const resp = await this.notion.pages.create({
        parent: { database_id: this.#dbId },
        properties: {
          title: { title: [{ text: { content: dto.title } }] },
          // userId: { number: dto.userId },
          memo: { rich_text: [{ text: { content: dto.memo ?? '' } }] },
          actAttempts: { number: dto.actAttempts },
          estAttempts: { number: dto.estAttempts },
        },
      });
      return { pageId: resp.id };
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TaskNotionDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async updateTasks(tasks: UpdateTaskDto[]): Promise<string> {
    let notUpdatedTaskIds = '';
    try {
      await Promise.all(
        tasks.map(async (task) => {
          const resp = await this.updateTask(task);
          if (!resp) {
            notUpdatedTaskIds = notUpdatedTaskIds.concat(`,${task.pageId}`);
          }
        }),
      );
      return `${tasks.length} tasks successfully updated`;
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TaskNotionDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async updateTask(dto: UpdateTaskDto): Promise<string> {
    try {
      if (!dto.pageId) {
        throw new Error('pageId is required');
      }
      const { title, memo, actAttempts, estAttempts, isFinished, isArchived } = dto;
      const updatedFields = {};
      !isNil(title) &&
        (updatedFields['title'] = {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        });
      !isNil(memo) &&
        (updatedFields['memo'] = {
          rich_text: [
            {
              text: {
                content: memo,
              },
            },
          ],
        });
      !isNil(actAttempts) &&
        (updatedFields['actAttempts'] = {
          number: actAttempts,
        });
      !isNil(estAttempts) &&
        (updatedFields['estAttempts'] = {
          number: estAttempts,
        });
      !isNil(isFinished) &&
        (updatedFields['isFinished'] = {
          checkbox: isFinished,
        });
      !isNil(isArchived) &&
        (updatedFields['isArchived'] = {
          checkbox: isArchived,
        });

      const resp = await this.notion.pages.update({
        page_id: dto.pageId,
        properties: updatedFields,
      });
      return `${resp.id} updated`;
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TaskNotionDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async archiveTask(id: string) {
    try {
      const resp = await this.notion.pages.update({ page_id: id, archived: true });
      return { ok: true, body: `${resp.id} deleted (actually archived)` };
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TaskNotionDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async getCurrentTask(): Promise<getCurrentTaskDto | null> {
    try {
      const resp = (
        await this.notion.databases.query({
          database_id: this.#dbId,
          sorts: [
            {
              property: 'updatedAt',
              direction: 'descending',
            },
          ],
          filter: {
            and: [
              {
                property: 'isCurrentTask',
                checkbox: { equals: true },
              },
            ],
          },
        })
      )?.results[0];
      if (!resp) {
        throw new Error(`can't find user's current task.`);
      }

      const properties = resp['properties'];
      return properties
        ? {
            id: resp.id,
            isCurrentTask: properties.isCurrentTask.checkbox,
          }
        : null;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async getAllBlocks(pageId: string) {
    try {
      const resp = await this.notion.blocks.children.list({
        block_id: pageId,
        page_size: 100,
      });
      return resp.results;
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TaskNotionDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }
}
