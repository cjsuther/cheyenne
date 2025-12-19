import crypto from 'crypto';

export function EncryptPassword(password) {
  const passwordEncrypted = crypto.createHash('sha1').update(password,'utf16le').digest('hex');
  return passwordEncrypted;
}

