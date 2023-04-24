import { Client } from '@notionhq/client';
import { ConfigService } from '@nestjs/config';

export class TaskDbService {
  private notion: any;
  private readonly notionApiKey: string;
  private readonly dbId: string;
  private config = new ConfigService();

  constructor() {
    this.notionApiKey = this.config.get('notion.api_key') ?? '';
    this.notion = new Client({ auth: this.notionApiKey });
    this.dbId = this.config.get('notion.task_table_id') ?? '';
  }

  async getTasks(): Promise<any> {
    const resp = await this.notion.databases.query({
      database_id: this.dbId,
      sorts: [
        {
          property: 'updatedAt',
          direction: 'descending',
        },
      ],
    });
    console.log(resp);
    return await Promise.all(resp.results.map((result) => result.properties));
  }
}
