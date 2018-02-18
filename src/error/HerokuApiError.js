export default class HerokuApiError {
  constructor(message) {
    this.message = message;
    this.type = 'Heroku API Error';
    this.status = 500;
  }

  toString() {
    return `${this.type} ${this.status}: ${this.message}`;
  }
}
