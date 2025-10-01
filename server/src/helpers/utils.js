import crypto from 'crypto';

export const encryptToken = (token) => {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  const ALGORITHM = process.env.ENCRYPTION_ALGORITHM;

  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );

  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Return iv, encrypted data, and auth tag as a single string
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
};

export const decryptToken = (encryptedToken) => {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  const ALGORITHM = process.env.ENCRYPTION_ALGORITHM;

  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }

  const parts = encryptedToken.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format');
  }

  const [ivHex, encryptedData, authTagHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

export const generateSecureString = (length = 64) => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_';
  const charsetLength = charset.length; // 65 characters

  let result = '';
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    // Use modulo to map random byte to charset index
    result += charset[randomBytes[i] % charsetLength];
  }

  return result;
};

export const base64Encode = (str) => {
  return Buffer.from(str).toString('base64');
};
