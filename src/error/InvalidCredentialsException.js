import { getActiveLogger } from '../utils/winston';

const log = getActiveLogger();

export default class InvalidCredentialsException {
  constructor(field, message) {
    this.field = field;
    this.message = message;
    this.type = 'Invalid Credentials';
    this.status = 403;
    log.error(message);
  }

  toString() {
    return `${this.type} ${this.status}: ${this.field} ${this.message}`;
  }
}
