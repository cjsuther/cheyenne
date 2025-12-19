import JSEncrypt from 'node-jsencrypt'
import config from '../../../server/configuration/config';

export default (text) => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(config.SECRETS.RSA_PUBLIC_KEY)
    return encrypt.encrypt(text)
}
