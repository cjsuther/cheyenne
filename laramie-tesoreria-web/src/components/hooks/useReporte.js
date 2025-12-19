import { useState, useEffect } from 'react';
import { APIS } from '../../config/apis';
import { REQUEST_METHOD } from '../../consts/requestMethodType';
import { ServerRequest } from '../../utils/apiweb';


export const useReporte = (initialState = {}) => {

    const [state, setState] = useState(initialState);
    const [reporte, setReporte] = useState({
        reporte: '',
        params: null
    });

    useEffect(() => {
        if (reporte.reporte.length > 0) {
            GenerateReport(reporte.reporte, reporte.params);
        }
    }, [reporte])
    

    //callbacks
    const callbackNoSuccess = (response) => {
        response.json()
        .then((error) => {
            const message = error.message;
            state.callback(reporte.reporte, null, message);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            state.callback(reporte.reporte, null, message);
        });
    }
    const callbackError = (error) => {
        const message = 'Error procesando solicitud: ' + error.message;
        state.callback(reporte.reporte, null, message);
    }
    const callbackSuccessBlob = (response) => {
        response.blob()
        .then((buffer) => {
            if (state.callback) {
                state.callback(reporte.reporte, buffer, null);
            }
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            state.callback(reporte.reporte, null, message);
        });
    };
    const callbackSuccessJson = (response) => {
        response.json()
        .then((buffer) => {
            if (state.callback) {
                state.callback(reporte.reporte, buffer, null);
            }
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            state.callback(reporte.reporte, null, message);
        });
    };

    //function
    const GenerateReport = (reporte, paramsReporte) => {
        const mode = state.mode??'blob';
        const paramsUrl = `/${mode}/${reporte}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.REPORTE,
            paramsUrl,
            paramsReporte,
            (mode === 'blob') ? callbackSuccessBlob : callbackSuccessJson,
            callbackNoSuccess,
            callbackError
        );
    }

    const generate = (_reporte, _params) => {
        setReporte({
            reporte: _reporte,
            params: _params
        });
    }
    const set = (_newState) => {
        setState( _newState );
    }

    return [ generate, set ];
}
