import { APPCONFIG } from "../app.config";
import LocalStorage from "../context/storage/localStorage"
import { parseJwt } from "./convert"

export const getAccess = () => {
    try {
        const token = LocalStorage.get('accessToken')
        return { ...parseJwt(token), token }
    }
    catch {
        window.location.href = APPCONFIG.SITE.WEBAPP + 'unauthorized';
    }
}