import NotFoundException from './NotFoundException';

export default class TravisTokenNotFoundException extends NotFoundException {
  constructor(message) {
    super(message, 'Not Found', 404);
  }
}
