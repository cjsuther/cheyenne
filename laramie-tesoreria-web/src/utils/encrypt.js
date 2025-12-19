import { JSEncrypt } from 'jsencrypt'
import { APPCONFIG } from '../app.config'

export default (text) => {
    var encrypt = new JSEncrypt()
    encrypt.setPublicKey(APPCONFIG.SECRETS.RSA_PUBLIC_KEY)
    return encrypt.encrypt(text)
}