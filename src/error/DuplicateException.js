import { getActiveLogger } from '../utils/winston';

const log = getActiveLogger();
export default class DuplicateException {
  constructor(message) {
    this.message = message;
    this.type = 'Duplicate';
    this.status = 422;
    log.error(message);
  }

  toString() {
    return `${this.type} ${this.status}: ${this.message}`;
  }
}
