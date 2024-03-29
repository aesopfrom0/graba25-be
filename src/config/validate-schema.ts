import * as Joi from 'joi';

export function validateSchema() {
  return Joi.object({
    NODE_ENV: Joi.string().valid('local', 'dev', 'prod', 'test').default('dev'),
    PORT: Joi.number().required(),
    NOTION_API_KEY: Joi.string().required(),
    TASK_TABLE_ID: Joi.string().required(),
    MIGRATE_DB: Joi.boolean().default(false),
  });
}
