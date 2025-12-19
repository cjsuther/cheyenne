import { APIS } from "../config/apis"
import { ALERT_TYPE } from "../consts/alertType"
import { REQUEST_METHOD } from "../consts/requestMethodType"
import { ServerRequest } from "./apiweb"
import ShowToastMessage from "./toast"

export const onRequestProcessError = (error) => new Promise((resolve, reject) => {
    ShowToastMessage(ALERT_TYPE.ALERT_ERROR, `Error procesando respuesta: ${error}`)
    resolve(error)
})

export const onRequestNoSuccess = (response) => new Promise((resolve, reject) => {
    response.json()
    .then(error => {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error.message)
        resolve(error)
    }).catch(error => {
        onRequestProcessError(error).then(() => {
            resolve(error)
        })
    })
})

export const onRequestError = (error) => new Promise((resolve, reject) => {
    ShowToastMessage(ALERT_TYPE.ALERT_ERROR, `Error procesando solicitud: ${error.message}`)
    resolve(error)
})

export const standardRequest = (method, path, body, options) => new Promise((resolve, reject) => {
    if (options?.format && !['json', 'text', 'blob', 'arrayBuffer'].includes(options.format))
        throw new Error('Invalid response format')

    ServerRequest(
        method,
        null,
        true,
        path,
        null,
        body,
        res => {
            res[options?.format ?? 'json']().then(resolve).catch(error => {
                if (!options?.disableToast) onRequestProcessError(error).then(reject)
                else reject(error)
            })
        },
        res => {
            if (!options?.disableToast) onRequestNoSuccess(res).then(reject)
            else res.json().then(reject).catch(resolve)
        },
        error => {
            if (!options?.disableToast) onRequestError(error).then(reject)
            else reject(error)
        },
    )
})

export const postTempFile = (file64, folder) => {
    return new Promise((resolve, reject) => {
        ServerRequest(
            REQUEST_METHOD.POST,
            { "Content-Type": "application/octet-stream" },
            true,
            APIS.URLS.FILE,
            folder ? `/${folder}` : null,
            file64,
            res => {
                res.text()
                .then(resolve)
                .catch(error => onRequestProcessError(error).then(reject))
            },
            res => onRequestNoSuccess(res).then(reject),
            error => onRequestError(error).then(reject),
            false,
        )
    })
}
