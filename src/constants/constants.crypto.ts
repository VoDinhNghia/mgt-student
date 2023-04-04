import { createCipheriv, createDecipheriv, createHash } from 'crypto';

export const key = () => {
  const salt = 'student api @10NH';
  const hash = createHash('sha1');
  hash.update(salt);
  const key = hash.digest().slice(0, 16);
  return key;
};
export const keyIv = Buffer.alloc(16, 0);
export const algorithm = 'aes-128-cbc';

export function cryptoPassWord(passWord: string) {
  const cipher = createCipheriv(algorithm, key(), keyIv);
  let encrypted = cipher.update(passWord, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return '@' + encrypted.toUpperCase();
}

export function dicipherPassWord(passWord: string) {
  const decipher = createDecipheriv(algorithm, key(), keyIv);
  let decrypted = decipher.update(passWord, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
