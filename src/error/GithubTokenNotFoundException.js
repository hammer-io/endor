import NotFoundException from './NotFoundException';

export default class GithubTokenNotFoundException extends NotFoundException {
  constructor(message) {
    super(message, 'Not Found', 404);
  }
}
