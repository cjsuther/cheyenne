import { useEffect, useState } from 'react';
import { APIS } from '../../config/apis';
import { REQUEST_METHOD } from '../../consts/requestMethodType';
import { ServerRequest } from '../../utils/apiweb';
import { isValidString } from '../../utils/validator';
import { useDispatch, useSelector } from 'react-redux';
import { memoActionSet } from '../../context/redux/actions/memoAction';


export const useAccess = (props) => {
    
    const [ready, setReady] = useState(false);
    const [key, setKey] = useState(null);
    const [accesses, setAccesses] = useState([]);

    const dispatch = useDispatch();
    const {cache} = useSelector( (state) => state.memo );


    useEffect(() => {
        setKey(props.key);
    }, []);

    useEffect(() => {
        if (isValidString(key, true)) {
            const item = cache[key];
            if (item) {
                const data = [...item.value];
                setAccesses(data);
                setReady(true);
                if (props.onLoaded) props.onLoaded(data, true, null);
            }
            else {
                SearchAccesses();
            }
        }
    }, [key]);
    

    // Callbacks

    const callbackNoSuccess = (response) => {
        response.json()
        .then((error) => {
            const message = error.message;
            if (props.onLoaded) props.onLoaded(null, false, message);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            if (props.onLoaded) props.onLoaded(null, false, message);
        });
    }
    const callbackError = (error) => {
        const message = 'Error procesando solicitud: ' + error.message;
        if (props.onLoaded) props.onLoaded(null, false, message);
    }
    const callbackSuccess = (response) => {
        response.json()
        .then((data) => {
            dispatch(memoActionSet(key, data, -1)); //no aplico timeout
            setAccesses(data);
            setReady(true);
            if (props.onLoaded) props.onLoaded(data, true, null);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            if (props.onLoaded) props.onLoaded(null, false, message);
        });
    };

    // Function

    const SearchAccesses = () => {
        setReady(false);

        const paramsUrl = `/usuario`;
        
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PERMISO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    }

    // Return

    return [ accesses , ready ];

}
