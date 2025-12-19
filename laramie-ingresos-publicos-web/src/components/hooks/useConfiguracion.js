import { useEffect, useState } from 'react';
import { APIS } from '../../config/apis';
import { REQUEST_METHOD } from '../../consts/requestMethodType';
import { ServerRequest } from '../../utils/apiweb';
import { isValidString } from '../../utils/validator';


export const useConfiguracion = (props) => {
    
    const [ready, setReady] = useState(false);
    const [key, setKey] = useState(null);
    const [value, setValue] = useState(null);

    useEffect(() => {
        setKey(props.key);
    }, []);

    useEffect(() => {
        if (isValidString(key, true)) {
            SearchConfiguracion();
        }
    }, [key]);

    //callbacks
    const callbackNoSuccess = (response) => {
        response.json()
        .then((error) => {
            const message = error.message;
            if (props.onLoaded) props.onLoaded(props.listas, false, message);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            if (props.onLoaded) props.onLoaded(props.listas, false, message);
        });
    }
    const callbackError = (error) => {
        const message = 'Error procesando solicitud: ' + error.message;
        if (props.onLoaded) props.onLoaded(props.listas, false, message);
    }
    const callbackSuccess = (response) => {
        response.json()
        .then((data) => {
            setReady(true);
            setValue(data.valor);
            if (props.onLoaded) props.onLoaded(data, true, null);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            if (props.onLoaded) props.onLoaded(null, false, message);
        });
    };

    //function
    const SearchConfiguracion = () => {
        setReady(false);

        const paramsUrl = `/${key}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CONFIGURACION,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    }

    return [ value, setKey, ready ];

}
