import { getAccess } from "./access"

export const openTempView = (url, options) => {
    let params = '?tempView=true'

    if (options?.addAuth) {
        const { token } = getAccess()
        params += `&token=${token}`
    }

    window.open(url + params)
}
