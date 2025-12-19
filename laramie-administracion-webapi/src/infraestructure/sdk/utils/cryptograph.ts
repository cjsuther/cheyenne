import config from './../../../server/configuration/config';
import Cryptr from 'cryptr';

const password = config.ENCRYPT_PASSWORD;

export function EncryptedString(value) {
    let encryptedString = "";

    try {
        const cryptr = new Cryptr(password);
        encryptedString = cryptr.encrypt(value); 
    }
    catch(error) {
        return encryptedString;
    }

    return encryptedString;
}

export function DecryptedString(value) {
    let decryptedString = "";

    try {
        const cryptr = new Cryptr(password);
        decryptedString = cryptr.decrypt(value); 
    }
    catch(error) {
        return decryptedString;
    }

    return decryptedString;
}
