import * as Joi from 'joi';

export function validateSchema() {
  return Joi.object({
    NODE_ENV: Joi.string().valid('local', 'dev', 'prod', 'test').default('dev'),
    PORT: Joi.number(),
    SERVER_URL: Joi.string().required(),
    NOTION_API_KEY: Joi.string().required(),
    TASK_TABLE_ID: Joi.string().required(),
    MIGRATE_DB: Joi.boolean().default(false),
    MONGODB_URI: Joi.string().required(),
    MONGODB_AUTO_CREATE: Joi.boolean().default(false),
    MONGODB_AUTO_INDEX: Joi.boolean().default(false),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    BY25_URL: Joi.string().required(),
  });
}
