import * as crypto from "crypto";
import config from "../../server/configuration/config";

export default class CryptoService {
  secretKey: string;
  private readonly algorithm = "aes-256-cbc";

  constructor() {
    this.secretKey = config.CRYPTO.SECRET_KEY;
  }

  encryptObject(obj) {
    const text = JSON.stringify(obj);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.secretKey, "hex"),
      iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  decryptObject(encryptedText: string) {
    const textParts = encryptedText.split(":");
    const iv = Buffer.from(textParts.shift()!, "hex"); // Extraer el IV
    const encryptedData = textParts.join(":"); // Datos encriptados
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.secretKey, "hex"),
      iv
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  }

  decodeBase64(encodedText) {
    return Buffer.from(encodedText, "base64").toString("ascii");
  }

  encodeBase64(encryptedText) {
    return Buffer.from(encryptedText).toString("base64");
  }
}
