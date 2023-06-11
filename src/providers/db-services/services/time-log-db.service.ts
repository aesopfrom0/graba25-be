import { Injectable } from '@nestjs/common';
import { BaseTimeLogDto } from 'src/tasks/dtos/time-log.dto';
import { BaseDbService } from './base-db.service';

@Injectable()
export class TimeLogDbService extends BaseDbService {
  readonly #dbId: string;

  constructor() {
    super();
    this.#dbId = this.config.get('TIME_LOG_TABLE_ID') ?? '';
  }

  async createTimeLog(dto: BaseTimeLogDto) {
    console.log(this.#dbId);
    console.log(dto);
    try {
      const { taskId, userId, durationSecs, dateTimeRange } = dto;
      const properties = {
        title: { title: [{ text: { content: '' } }] },
        taskId: { rich_text: [{ text: { content: taskId } }] },
        userId: { number: userId },
        durationSecs: { number: durationSecs },
        dateTimeRange: { date: dateTimeRange },
      };

      const resp = await this.notion.pages.create({
        parent: { database_id: this.#dbId },
        properties,
      });

      return { ok: true, message: resp.id };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }
}
