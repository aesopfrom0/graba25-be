import { Injectable } from '@nestjs/common';
import { CreateTimeLogDto, GetTimeLogDto } from 'src/tasks/dtos/time-log.dto';
import { BaseNotionDbService } from './base-notion-db.service';

@Injectable()
export class TimeLogNotionDbService extends BaseNotionDbService {
  readonly #dbId: string;
  readonly #taskDbId: string;

  constructor() {
    super();
    this.#dbId = this.config.get('TIME_LOG_TABLE_ID') ?? '';
    this.#taskDbId = this.config.get('TASK_TABLE_ID') ?? '';
  }

  async createTimeLog(dto: CreateTimeLogDto) {
    try {
      const { taskId, userId, durationSecs, dateTimeRange } = dto;
      const properties = {
        title: { title: [{ text: { content: '' } }] },
        userId: { number: userId },
        durationSecs: { number: durationSecs },
        dateTimeRange: { date: dateTimeRange },
        task: { relation: [{ id: taskId }] },
      };

      const resp = await this.notion.pages.create({
        parent: { database_id: this.#dbId },
        properties,
      });

      return { ok: true, body: resp.id };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async getTimeLogs(): Promise<GetTimeLogDto[]> {
    const resp = (
      await this.notion.databases.query({
        database_id: this.#dbId,
        // relation?
        sorts: [
          {
            property: 'createdAt',
            direction: 'descending',
          },
        ],
        filter: {
          or: [
            {
              property: 'task',
              relation: {
                is_not_empty: true,
              },
            },
          ],
        },
      })
    )?.results;
    const result = [] as GetTimeLogDto[];
    for (const log of resp) {
      const properties = log['properties'];

      // Fetch the related task data
      const taskRelation = properties.task.relation;
      const task = await this.notion.pages.retrieve({ page_id: taskRelation[0].id });

      const taskId = task.id;
      const taskTitle = task['properties'].title.title[0].plain_text ?? '';

      properties &&
        result.push({
          id: log.id,
          userId: properties.userId.number,
          durationSecs: properties.durationSecs.number,
          dateTimeRange: properties.dateTimeRange.date,
          task: {
            id: taskId,
            title: taskTitle,
          },
        });
    }
    return result;
  }
}
