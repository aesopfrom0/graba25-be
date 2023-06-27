import { Client } from '@notionhq/client';
import { dbStructure } from './db-structure';

export async function runMigration() {
  try {
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });
    const parentPageId = process.env.NOTION_PARENT_PAGE_ID ?? '';
    console.log(parentPageId);

    for (const tableName in dbStructure) {
      console.log(`tableName: ${tableName}`);
      const { properties } = dbStructure[tableName];

      const response = await notion.databases.create({
        parent: { type: 'page_id', page_id: parentPageId },
        title: [{ type: 'text', text: { content: tableName } }],
        properties,
      });

      console.log(`Created ${tableName} table with ID: ${response.id}`);
    }
  } catch (error) {
    console.error('Migration failed', error);
  }
}
