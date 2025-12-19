import { REQUEST_METHOD } from "../consts/requestMethodType";
import ProcessError from '../error/process-error';
import config from '../../../server/configuration/config';
import encrypt from "./encrypt";

const port = config.PORT;
const domain = config.DOMAIN;

export const CreateRequest = (
    method: string = REQUEST_METHOD.GET,
    paramsHeaders: string[][] = null,
    token: string = null,
    urlEndPoint: string  = null,
    paramsUrl: string  = null,
    dataBody: object = null) =>
{

    let headers = { };
    if (paramsHeaders) {
        for (let i=0; i < paramsHeaders.length; i++) {
            const key = paramsHeaders[i][0];
            const value = paramsHeaders[i][1];
            headers[key] = value;
        }
    }
    if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    headers["Origin"] = `${domain}:${port}`;

    const options = {
        method: method,
        headers:headers,
        body: (dataBody) ? JSON.stringify(dataBody) : null
    };
    const url = (paramsUrl) ? urlEndPoint + paramsUrl : urlEndPoint;

    return {
        url: url,
        options: options
    };
};

export const SendRequest = async (
    token: string,
    paramsUrl: string,
    dataBody: object,
    method: string,
    urlEndpoint: string) =>
{

    return new Promise( async (resolve, reject) => {
        try {
            const request = CreateRequest(
                method,
                null,
                token,
                urlEndpoint,
                paramsUrl,
                dataBody
            );
            
            fetch(request.url, request.options)
            .then((response) => {
                if (response.ok)
                    response.json().then(resolve).catch(reject);
                else
                    response.json().then(reject).catch(reject);
            })
            .catch((error) => {
                reject(new ProcessError('Error de conexión', error));
            });
        }
        catch(error) {
            reject(new ProcessError('Error procesando datos', error));
        }
    });

};

export const SendRequestStream = async (
    token: string,
    paramsUrl: string,
    dataBody: object,
    method: string,
    urlEndpoint: string) =>
{

    return new Promise( async (resolve, reject) => {
        try {
            const request = CreateRequest(
                method,
                null,
                token,
                urlEndpoint,
                paramsUrl,
                dataBody
            );
            
            fetch(request.url, request.options)
            .then((response) => {
                if (response.ok)
                    response.blob()
                    .then(blob => {
                        blob.arrayBuffer()
                        .then(arrayBuffer => {
                            const buffer = Buffer.from(arrayBuffer);
                            resolve(buffer);
                        })
                        .catch(reject);
                    })
                    .catch(reject);
                else
                    response.json().then(reject).catch(reject);
            })
            .catch((error) => {
                reject(new ProcessError('Error de conexión', error));
            });
        }
        catch(error) {
            reject(new ProcessError('Error procesando datos', error));
        }
    });

};

export const Login = async () => {
  return new Promise( async (resolve, reject) => {
    try {

    const domian = config.DOMAIN;
    const port = config.PORT;
    const headers = { 
    "Content-Type": "application/json",
    "Origin": `${domian}:${port}`
    }

    const dataBody = {
        "username": config.ACCESS.USR,
        "password": encrypt(config.ACCESS.PSW)
    }
    const options = {
        method: "POST",
        headers: headers,
        body: (dataBody) ? JSON.stringify(dataBody) : null
    };
    const url = config.SITE.LOGIN;

    fetch(url, options)
    .then((response) => {
        if (response.ok)
            response.text().then(resolve).catch(reject);
        else
            response.text().then(reject).catch(reject);
    })
    .catch(reject);

    }
    catch(error) {
        reject(error);
    }

  });
}