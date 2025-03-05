import * as openpgp from 'openpgp';
import * as CryptoJS from 'crypto-js';

export class EncryptionService {
  // Tạo cặp khóa PGP + AES Key
  static async generateKeyPair(name: string, email: string) {
    const { privateKey, publicKey } = await openpgp.generateKey({
      type: 'rsa',
      rsaBits: 4096,
      userIDs: [{ name, email }],
    });

    const aesKey = CryptoJS.lib.WordArray.random(32).toString(
      CryptoJS.enc.Base64,
    );
    const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64);

    // Mã hóa Private Key bằng AES-GCM
    const encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, aesKey, {
      iv: CryptoJS.enc.Base64.parse(iv),
    }).toString();

    // Mã hóa AES Key bằng khoá gốc của server (hoặc mật khẩu user)
    const masterKey = process.env.MASTER_KEY || 'supersecretkey'; // Thay thế bằng khoá thực tế
    const aesEncryptedKey = CryptoJS.AES.encrypt(aesKey, masterKey).toString();

    return { publicKey, encryptedPrivateKey, aesEncryptedKey, iv };
  }

  // Giải mã Private Key khi user đăng nhập
  static async decryptPrivateKey(
    encryptedPrivateKey: string,
    aesEncryptedKey: string,
    iv: string,
  ) {
    const masterKey = process.env.MASTER_KEY || 'supersecretkey';
    const aesKey = CryptoJS.AES.decrypt(aesEncryptedKey, masterKey).toString(
      CryptoJS.enc.Utf8,
    );
    if (!aesKey)
      throw new Error('Failed to decrypt AES key. Check master key.');

    const privateKey = CryptoJS.AES.decrypt(encryptedPrivateKey, aesKey, {
      iv: CryptoJS.enc.Base64.parse(iv),
    }).toString(CryptoJS.enc.Utf8);

    if (!privateKey) throw new Error('Failed to decrypt Private Key.');
    return privateKey;
  }
}
