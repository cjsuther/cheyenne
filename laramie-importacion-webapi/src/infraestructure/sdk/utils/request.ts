import { REQUEST_METHOD } from "../consts/requestMethodType";
import ProcessError from '../error/process-error';
import config from '../../../server/configuration/config';
import http from 'node:http';

const port = config.PORT;
const domain = config.DOMAIN;


export const CreateUrl = (
  urlEndPoint: string = null,
  paramsUrl: string = null
) => {
  const url = paramsUrl ? urlEndPoint + paramsUrl : urlEndPoint;
  return url;
};

export const CreateRequest = (
    method: string = REQUEST_METHOD.GET,
    paramsHeaders: string[][] = null,
    token: string = null,
    urlEndPoint: string  = null,
    paramsUrl: string  = null,
    dataBody: object = null,
    timeOut: number = 60000) =>
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
        body: (dataBody) ? JSON.stringify(dataBody) : null,
        signal: AbortSignal.timeout(timeOut)
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
    urlEndpoint: string,
    timeOut: number = 60000) =>
{

    return new Promise( async (resolve, reject) => {
        try {
            const request = CreateRequest(
                method,
                null,
                token,
                urlEndpoint,
                paramsUrl,
                dataBody,
                timeOut
            );
            
            fetch(request.url, request.options)
            .then((response) => {
                if (response.ok) {
                    response.json().then(resolve).catch(reject);
                }
                else {
                    response.json().then(reject).catch(reject);
                }
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

export const SendRequestFormData = async (
  token: string,
  paramsUrl: string,
  dataBody: object,
  method: string,
  urlEndpoint: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = CreateUrl(urlEndpoint, paramsUrl);

      let headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const form = new FormData();
      Object.entries(dataBody).forEach(([clave, valor]) => {
        form.append(clave, valor);
      });

      fetch(url, {
        method: method,
        headers: headers,
        body: form,
      })
        .then((response) => {
          if (response.ok) response.json().then(resolve).catch(reject);
          else response.json().then(reject).catch(reject);
        })
        .catch((error) => {
          reject(new ProcessError("Error de conexión", error));
        });
    } catch (error) {
      reject(new ProcessError("Error procesando datos", error));
    }
  });
};

export const SendRequestStream = async (
  token: string,
  paramsUrl: string,
  dataBody: object,
  method: string,
  urlEndpoint: string
) => {
  return new Promise(async (resolve, reject) => {
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
            response
              .blob()
              .then((blob) => {
                blob
                  .arrayBuffer()
                  .then((arrayBuffer) => {
                    const buffer = Buffer.from(arrayBuffer);
                    resolve(buffer);
                  })
                  .catch(reject);
              })
              .catch(reject);
          else response.json().then(reject).catch(reject);
        })
        .catch((error) => {
          reject(new ProcessError("Error de conexión", error));
        });
    } catch (error) {
      reject(new ProcessError("Error procesando datos", error));
    }
  });
};


const CreateRequestHttpNode = (
    method: string = REQUEST_METHOD.GET,
    paramsHeaders: string[][] = null,
    token: string = null,
    urlEndPoint: string  = null,
    paramsUrl: string  = null,
    dataBody: object = null,
    timeOut: number) =>
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeOut);

    const options = {
        method: method,
        headers:headers,
        signal: controller.signal
    };
    const url = (paramsUrl) ? urlEndPoint + paramsUrl : urlEndPoint;

    return {
        url: url,
        options: options,
        postData: (dataBody) ? JSON.stringify(dataBody) : null,
        timeoutId: timeoutId
    };
};

const SendRequestHttpNode = async (
    token: string,
    paramsUrl: string,
    dataBody: object,
    method: string,
    urlEndpoint: string,
    timeOut: number = 60000) =>
{

    return new Promise( async (resolve, reject) => {
        try {

            const requestOption = CreateRequestHttpNode(
                method,
                null,
                token,
                urlEndpoint,
                paramsUrl,
                dataBody,
                timeOut
            );
            
            const req = http.request(requestOption.url, requestOption.options, (response) => {
                try {
                    response.setEncoding('utf8');
                    response.on('data', (data) => {
                        try {
                            const dataJSON = JSON.parse(data);
                            if (response.statusCode === 200)
                                resolve(dataJSON);
                            else
                                reject(dataJSON);
                        }
                        catch(error) {
                            reject(new ProcessError('Error procesando respuesta', error));
                        }
                    });
                    response.on('end', () => {});
                }
                catch(error) {
                    reject(new ProcessError('Error procesando solicitud', error));
                }
                finally {
                    clearTimeout(requestOption.timeoutId);
                }
            });

            req.on('error', (error) => {
                clearTimeout(requestOption.timeoutId);
                reject(new ProcessError('Error de conexión', error));
            });

            if (requestOption.postData) req.write(requestOption.postData);
            req.end();
            
        }
        catch(error) {
            reject(new ProcessError('Error procesando datos', error));
        }
    });

};
