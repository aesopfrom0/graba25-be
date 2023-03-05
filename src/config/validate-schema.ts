import * as Joi from 'joi';

export function validateSchema() {
  return Joi.object({
    NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
    port: Joi.number(),
  });
}
