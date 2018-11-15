const crypto = require('crypto');

const { PATRON_ENCRYPTION_KEY, PATRON_HMAC_KEY } = process.env;
const ENCRYPTION_KEY = Buffer.from(PATRON_ENCRYPTION_KEY, 'utf8'); // Must be 256 bytes (32 characters)
const HMAC_KEY = Buffer.from(PATRON_HMAC_KEY, 'utf8');

function encrypt(clearText) {
  let encryptedText = null;
  const textBuffer = Buffer.from(clearText, 'utf-8');
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  const encryptedBuffer = cipher.update(textBuffer);
  encryptedText = Buffer.concat([iv, encryptedBuffer, cipher.final()]).toString(
    'base64'
  );

  return encryptedText;
}

function decrypt(encryptedText) {
  let clearText = null;

  const encryptedBlob = Buffer.from(encryptedText, 'base64');
  const iv = encryptedBlob.slice(0, 16);
  const textBuffer = encryptedBlob.toString('base64', 16);

  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  clearText = decipher.update(textBuffer, 'base64', 'utf-8');
  clearText += decipher.final('utf-8');

  return clearText;
}

function hashPhone(phone) {
  const hmac = crypto.createHmac('sha256', HMAC_KEY);
  hmac.update(phone);
  return hmac.digest('hex');
}

module.exports = { decrypt, encrypt, hashPhone };
