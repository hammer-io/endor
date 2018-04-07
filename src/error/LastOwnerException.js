import { getActiveLogger } from '../utils/winston';

const log = getActiveLogger();

export default class LastOwnerException extends Error {
  constructor() {
    super();
    this.type = 'Error';
    this.type = 'LastOwnerError';
    this.status = 422;
    this.message = 'Cannot delete the last owner for a project.';
    log.error(this.toString());
  }

  toString() {
    return `${this.type} ${this.status}: ${this.message}`;
  }
}
