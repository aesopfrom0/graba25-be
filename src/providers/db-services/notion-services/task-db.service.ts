import { ConfigService } from '@nestjs/config';
import {
  GetTaskDto,
  BaseTaskDto,
  UpdateTaskDto,
  getCurrentTaskDto,
} from '../../../tasks/dtos/base-task.dto';
import { BaseResponseDto } from '../../../shared/dtos/base-response.dto';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Injectable } from '@nestjs/common';
import { BaseDbService } from './base-db.service';

@Injectable()
export class TaskDbService extends BaseDbService {
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
          title: properties.title.title[0].plain_text,
          userId: properties.userId.number,
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

  async createTask(dto: BaseTaskDto): Promise<BaseResponseDto> {
    try {
      const resp = await this.notion.pages.create({
        parent: { database_id: this.#dbId },
        properties: {
          title: { title: [{ text: { content: dto.title } }] },
          userId: { number: dto.userId },
          memo: { rich_text: [{ text: { content: dto.memo ?? '' } }] },
          actAttempts: { number: dto.actAttempts },
          estAttempts: { number: dto.estAttempts },
        },
      });
      return { ok: true, message: resp.id };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async updateTasks(tasks: UpdateTaskDto[]): Promise<BaseResponseDto> {
    let ok = true;
    let notUpdatedTaskIds = '';
    try {
      await Promise.all(
        tasks.map(async (task) => {
          const resp = await this.updateTask(task);
          if (!resp.ok) {
            ok = false;
            notUpdatedTaskIds = notUpdatedTaskIds.concat(`,${task.id}`);
          }
        }),
      );
      return { ok, message: `${tasks.length} tasks successfully updated` };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: 'notUpdatedTaskIds' + notUpdatedTaskIds + JSON.stringify(e) };
    }
  }

  async updateTask(dto: UpdateTaskDto): Promise<BaseResponseDto> {
    try {
      const { title, memo, actAttempts, estAttempts, isFinished, isArchived, isCurrentTask } = dto;
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
      !isNil(isCurrentTask) &&
        (updatedFields['isCurrentTask'] = {
          checkbox: isCurrentTask,
        });

      const resp = await this.notion.pages.update({
        page_id: dto.id,
        properties: updatedFields,
      });
      return { ok: true, message: `${resp.id} updated` };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async deleteTask(id: string) {
    try {
      const resp = await this.notion.pages.update({ page_id: id, archived: true });
      return { ok: true, message: `${resp.id} deleted (actually archived)` };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
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
      console.log(resp);
      return resp.results;
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }
}
