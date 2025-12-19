import { APIS } from "../config/apis"
export const localService = async (url = APIS.URLS.PRINTER, params = '', data, callbackSuccess, callbackNoSuccess ) => {

    const socket = new WebSocket(url + params)

    const searializedData = JSON.stringify(data)

    socket.onopen = () => {
        socket.send(searializedData)
    }

    socket.onmessage = (response) => {
        callbackSuccess(response)
    }

    socket.onerror = (error) => {
        callbackNoSuccess(error)
    }

}
