import NotFoundException from './NotFoundException';

export default class ZipFileNotFoundException extends NotFoundException {
  constructor(message) {
    super(message, 'Not Found', 404);
  }
}
