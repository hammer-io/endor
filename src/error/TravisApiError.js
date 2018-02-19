export default class TravisApiError {
  constructor(message) {
    this.message = message;
    this.type = 'Travis API Error';
    this.status = 500;
  }

  toString() {
    return `${this.type} ${this.status}: ${this.message}`;
  }
}
