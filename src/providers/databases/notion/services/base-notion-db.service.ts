import { ConfigService } from '@nestjs/config';
import { Client, LogLevel } from '@notionhq/client';
import { BaseService } from 'src/providers/base.service';

export class BaseNotionDbService extends BaseService {
  readonly config = new ConfigService();
  readonly notionApiKey: string;
  readonly notion: Client;

  constructor() {
    super();
    this.notionApiKey = this.config.get('NOTION_API_KEY') ?? '';
    this.notion = new Client({ auth: this.notionApiKey, logLevel: LogLevel.DEBUG });
  }
}
