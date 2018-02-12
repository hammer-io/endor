import crypto from 'crypto';
import config from 'config';

export function encrypt(data) {
  const cipher = crypto.createCipher('aes-256-cbc', config.encrypt.key.toString());
  let crypted = cipher.update(data, 'utf-8', 'hex');
  crypted += cipher.final('hex');

  return crypted;
}

export function decrypt(data) {
  const decipher = crypto.createDecipher('aes-256-cbc', config.encrypt.key.toString());
  let decrypted = decipher.update(data, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
}
