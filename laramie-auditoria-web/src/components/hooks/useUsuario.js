import { useEffect, useRef, useState } from 'react';
import { APIS } from '../../config/apis';
import { REQUEST_METHOD } from '../../consts/requestMethodType';
import { ServerRequest } from '../../utils/apiweb';


export const useUsuario = (props) => {
    
    const [ready, setReady] = useState(false);

    const dataRef = useRef([]);

    useEffect(() => {
        if (props.idUsuario > 0) {
            FindUsuario(props.idUsuario);
        }
    }, [props.idUsuario]);

    //callbacks
    const callbackNoSuccess = (response) => {
        response.json()
        .then((error) => {
            const message = error.message;
            if (props.onLoaded) props.onLoaded(props.idUsuario, false, message);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            if (props.onLoaded) props.onLoaded(props.idUsuario, false, message);
        });
    }
    const callbackError = (error) => {
        const message = 'Error procesando solicitud: ' + error.message;
        if (props.onLoaded) props.onLoaded(props.idUsuario, false, message);
    }
    const callbackSuccess = (response) => {
        response.json()
        .then((data) => {
            dataRef.current = data;
            setReady(true);
            if (props.onLoaded) props.onLoaded(props.idUsuario, true, null);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            if (props.onLoaded) props.onLoaded(props.idUsuario, false, message);
        });
    };

    //function
    const FindUsuario = (idUsuario) => {
        const paramsUrl = `/${idUsuario}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.USUARIO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    }

    //return
    const getData = () => {
        return (dataRef.current?? {});
    }

    return [ getData, ready ];

}
