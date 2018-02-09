import NotFoundException from './NotFoundException';

export default class HerokuTokenNotFoundException extends NotFoundException {
  constructor(message) {
    super(message, 'Not Found', 404);
  }
}
