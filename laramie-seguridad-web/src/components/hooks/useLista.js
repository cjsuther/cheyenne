import { useEffect, useRef, useState } from 'react';
import { APIS } from '../../config/apis';
import { REQUEST_METHOD } from '../../consts/requestMethodType';
import { ServerRequest } from '../../utils/apiweb';
import { useDispatch, useSelector } from 'react-redux';
import { memoActionSet } from '../../context/redux/actions/memoAction';


export const useLista = (props) => {
    
    const [ready, setReady] = useState(false);
    const dispatch = useDispatch();
    const {cache} = useSelector( (state) => state.memo );

    const listaRef = useRef([]);

    useEffect(() => {
        if (props.memo) { //se quiere recuperar el cache
            const today = new Date();
            const item = cache[props.memo.key];
            if (item && item.timeout > 0 && item.timeout > today.getTime()) { //el cache tiene datos y vigentes
                listaRef.current = item.value;
                setReady(true);
                if (props.onLoaded) props.onLoaded(props.listas, true, null);
            }
            else {
                SearchLista();
            }
        }
        else {
            SearchLista();
        }
    }, []);

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
            if (props.memo) {
                dispatch(memoActionSet(props.memo.key, data, props.memo.timeout));
            }
            listaRef.current = data;
            setReady(true);
            if (props.onLoaded) props.onLoaded(props.listas, true, null);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            if (props.onLoaded) props.onLoaded(props.listas, false, message);
        });
    };

    //function
    const SearchLista = () => {
        let paramLista = '';
        for(let i=0; i<props.listas.length; i++) {
            paramLista += (i>0) ? '&' : '';
            paramLista += props.listas[i];
        }
        const paramsUrl = `/${paramLista}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.LISTA,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    }

    //return
    const getListLista = (lista) => {
        return (listaRef.current[lista] ?? []);
    }
    const getRowLista = (lista, id) => {
        return (listaRef.current[lista] ?? []).find(f => f.id === id);
    }

    return [ getListLista, getRowLista, ready ];

}
