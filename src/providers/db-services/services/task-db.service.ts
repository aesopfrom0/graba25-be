import { Client } from '@notionhq/client';
import { ConfigService } from '@nestjs/config';

export class TaskDbService {
  config = new ConfigService();
  #notionApiKey: string;
  #notion: Client;
  #dbId: string;
  constructor() {
    this.#notionApiKey = this.config.get('NOTION_API_KEY') ?? '';
    this.#notion = new Client({ auth: this.#notionApiKey });
    this.#dbId = this.config.get('NOTION_TASK_TABLE_ID') ?? '';
  }

  async getTasks(): Promise<any> {
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
    return await Promise.all(
      resp.map((result) => (result.hasOwnProperty('properties') ? result['properties'] : null)),
    );
  }
}
