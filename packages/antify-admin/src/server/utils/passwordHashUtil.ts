import * as crypto from 'crypto';

export const hashPassword = async (
  password: string,
  salt: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        return reject(error);
      }

      resolve(derivedKey.toString('hex'));
    });
  });
};
