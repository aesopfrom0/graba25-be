import { Client, LogLevel } from '@notionhq/client';
import { ConfigService } from '@nestjs/config';
import { GetTaskDto, BaseTaskDto, UpdateTaskDto } from '../../../tasks/dtos/base-task.dto';
import { BaseResponseDto } from '../../../shared/dtos/base-response.dto';
import { BaseService } from '../../base.service';
import { isNil } from '@nestjs/common/utils/shared.utils';

export class TaskDbService extends BaseService {
  readonly #config = new ConfigService();
  readonly #notionApiKey: string;
  readonly #notion: Client;
  readonly #dbId: string;

  constructor() {
    super();
    this.#notionApiKey = this.#config.get('NOTION_API_KEY') ?? '';
    this.#notion = new Client({ auth: this.#notionApiKey, logLevel: LogLevel.DEBUG });
    this.#dbId = this.#config.get('NOTION_TASK_TABLE_ID') ?? '';
  }

  async getTasks(): Promise<GetTaskDto[]> {
    const resp = (
      await this.#notion.databases.query({
        database_id: this.#dbId,
        sorts: [
          {
            property: 'updatedAt',
            direction: 'descending',
          },
        ],
      })
    )?.results;
    console.log(resp);
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
          createdAt: properties.createdAt.created_time as string,
          updatedAt: properties.updatedAt.last_edited_time,
        });
    });
    return result;
  }

  async createTask(dto: BaseTaskDto): Promise<BaseResponseDto> {
    try {
      const resp = await this.#notion.pages.create({
        parent: { database_id: this.#dbId },
        properties: {
          title: { title: [{ text: { content: dto.title } }] },
          userId: { number: dto.userId },
          memo: { rich_text: [{ text: { content: dto.memo ?? '' } }] },
          actAttempts: { number: dto.actAttempts },
          estAttempts: { number: dto.estAttempts },
        },
      });
      return { ok: true, message: `${resp.id} task created` };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async updateTask(dto: UpdateTaskDto): Promise<BaseResponseDto> {
    try {
      const { title, memo, actAttempts, estAttempts } = dto;
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
      const resp = await this.#notion.pages.update({
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
      const resp = await this.#notion.pages.update({ page_id: id, archived: true });
      return { ok: true, message: `${resp.id} deleted (actually archived)` };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async getAllBlocks(pageId: string) {
    try {
      const resp = await this.#notion.blocks.children.list({
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

  // #addUpdateFields(...args) {}
}
