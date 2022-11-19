import { createCipher, createDecipher } from 'crypto';

export function cryptoPassWord(passWord: string) {
  const cipher = createCipher('aes128', 'student api @10NH');
  let password = cipher.update(passWord, 'utf8', 'hex');
  password += cipher.final('hex');
  return password;
}

export function dicipherPassWord(passWord: string) {
  const decipher = createDecipher('aes128', 'student api @10NH');
  let decrypted = decipher.update(passWord, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
