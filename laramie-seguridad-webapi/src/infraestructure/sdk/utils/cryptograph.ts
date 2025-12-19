import crypto from 'crypto';
import { JSEncrypt } from 'nodejs-jsencrypt'
import config from '../../../server/configuration/config';

export function EncryptPassword(password) {
  const passwordEncrypted = crypto.createHash('sha1').update(password,'utf16le').digest('hex');
  return passwordEncrypted;
}

export function DecryptRSA(text) {
  const privateKey = config.RSA_PRIVATE_KEY;
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(privateKey);
  const uncrypted = decrypt.decrypt(text);
  return (!uncrypted) ? "" : uncrypted;
}
