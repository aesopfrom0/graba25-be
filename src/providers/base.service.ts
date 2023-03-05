import { CustomLogger } from './custom-logger';

export class BaseService {
  protected readonly logger = new CustomLogger(this.constructor.name);
}
