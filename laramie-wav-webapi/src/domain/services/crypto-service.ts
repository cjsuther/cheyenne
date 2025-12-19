import fs from 'fs';
import * as crypto from "crypto";
import forge from 'node-forge';
import config from "../../server/configuration/config";

export default class CryptoService {
  secretKey: string;
  private readonly algorithm = "aes-256-cbc";
  private readonly algorithmASHA = "RSA-SHA1";

  constructor() {
    this.secretKey = config.CRYPTO.SECRET_KEY;
  }

  getPemFromP12(pathFileP12, password) {
    // Leer el archivo .p12 (binario)
    const p12Buffer = fs.readFileSync(pathFileP12);
    const p12Der = forge.util.createBuffer(p12Buffer.toString('binary'));
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    // Parsear el archivo .p12
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
    // Extraer clave privada (PKCS#8 shrouded)
    const keyObj = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[
      forge.pki.oids.pkcs8ShroudedKeyBag
    ][0].key;
    // Convertir a PEM
    const privateKeyPem = forge.pki.privateKeyToPem(keyObj);

    return privateKeyPem;
  }
  encryptObjectSHA(signatureText, privateKeyPem) {
    const signer = crypto.createSign(this.algorithmASHA);
    signer.update(signatureText);
    signer.end();

    const signatureBase64 = signer.sign(privateKeyPem, 'base64');

    return signatureBase64;
  }
  encryptObjectSHAFromP12(signatureText, pathFileP12, password) {
    const privateKeyPem = this.getPemFromP12(pathFileP12, password);
    const  signatureBase64 = this.encryptObjectSHA(signatureText, privateKeyPem);

    return signatureBase64;
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
