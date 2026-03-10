import crypto from 'node:crypto';

/**
 * Creates a cryptographically secure random salt
 * @returns Promise<string> Base64-encoded salt
 */
export async function createSalt(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf.toString('base64'));
      }
    });
  });
}

/**
 * Creates a hashed password with a new salt using PBKDF2
 * @param password Plain text password
 * @returns Promise containing the hashed password and salt
 */
export async function createHashedPassword(
  password: string
): Promise<{ hashed_password: string; salt: string }> {
  const salt = await createSalt();

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 9999, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          hashed_password: derivedKey.toString('base64'),
          salt,
        });
      }
    });
  });
}

/**
 * Creates a hashed password using an existing salt
 * @param salt The salt to use for hashing
 * @param password Plain text password
 * @returns Promise containing the hashed password
 */
export async function makePasswordHashed(
  salt: string,
  password: string
): Promise<{ hashed_password: string }> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 9999, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          hashed_password: derivedKey.toString('base64'),
        });
      }
    });
  });
}
