import { useEffect, useRef, useState } from 'react';
import { APIS } from '../../config/apis';
import { REQUEST_METHOD } from '../../consts/requestMethodType';
import { ServerRequest } from '../../utils/apiweb';
import { useDispatch, useSelector } from 'react-redux';
import { memoActionSet } from '../../context/redux/actions/memoAction';


export const useEntidad = (props) => {
    
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
                if (props.onLoaded) props.onLoaded(props.entidades, true, null);
            }
            else {
                SearchEntidad();
            }
        }
        else {
            SearchEntidad();
        }
    }, []);

    //callbacks
    const callbackNoSuccess = (response) => {
        response.json()
        .then((error) => {
            const message = error.message;
            if (props.onLoaded) props.onLoaded(props.entidades, false, message);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            if (props.onLoaded) props.onLoaded(props.entidades, false, message);
        });
    }
    const callbackError = (error) => {
        const message = 'Error procesando solicitud: ' + error.message;
        if (props.onLoaded) props.onLoaded(props.entidades, false, message);
    }
    const callbackSuccess = (response) => {
        response.json()
        .then((data) => {
            if (props.memo) {
                dispatch(memoActionSet(props.memo.key, data, props.memo.timeout));
            }
            listaRef.current = data;
            setReady(true);
            if (props.onLoaded) props.onLoaded(props.entidades, true, null);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            if (props.onLoaded) props.onLoaded(props.entidades, false, message);
        });
    };

    //function
    const SearchEntidad = () => {
        let paramEntidad = '';
        for(let i=0; i<props.entidades.length; i++) {
            paramEntidad += (i>0) ? '&' : '';
            paramEntidad += props.entidades[i];
        }
        if (props.idFilter) {
            paramEntidad += '/filter?idFilter=' + props.idFilter;
        }
        const paramsUrl = `/${paramEntidad}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.ENTIDAD,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    }

    //return
    const getListEntidad = (entidad) => {
        return (listaRef.current[entidad] ?? []);
    }
    const getRowEntidad = (entidad, id) => {
        return (listaRef.current[entidad] ?? []).find(f => f.id === id);
    }

    return [ getListEntidad, getRowEntidad, ready ];

}
