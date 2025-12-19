import { useState } from "react";
import { APIS } from "../../config/apis";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { ServerRequest } from "../../utils/apiweb";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { memoActionSet } from "../../context/redux/actions/memoAction";
import { ALERT_TYPE } from "../../consts/alertType";
import ShowToastMessage from "../../utils/toast";

// props = { listas, entidades, memo }

export const useListaEntidad = (props) => {
    const [readies, setReadies] = useState({ listas: false, entidades: false, })
    const [items, setItems] = useState({ listas: {}, entidades: {}, })

    const dispatch = useDispatch()
    const { cache } = useSelector(state => state.memo)

    useEffect(() => {
        if (props.memo) { //se quiere recuperar el cache
            const cacheItem = cache[props.memo.key];
            if (cacheItem && cacheItem.timeout > 0 && cacheItem.timeout > (new Date()).getTime()) { //el cache tiene datos y vigentes
                setItems(cacheItem.value)
                setReadies({ listas: true, entidades: true })
            }
            else {
                fetch()
            }
        }
        else {
            fetch()
        }
    }, [])

    useEffect(() => {
        if (props.memo && readies.listas && readies.entidades) dispatch(memoActionSet(props.memo.key, items, props.memo.timeout))
    }, [readies])

    const onNoSuccess = (response) => {
        response.json()
            .then((error) => {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error.message)
            })
            .catch((error) => {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + error)
            });
    }

    const onError = (error) => {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando solicitud: ' + error.message)
    }

    const onSuccess = (res, type) => {
        res.json()
            .then(data => {
                const result = {}
                Object.keys(data).forEach(key => {
                    result[key] = {}
                    data[key].forEach(item => result[key][item.id] = item)
                })

                setItems(prev => ({ ...prev, [type]: result, }))
                setReadies(prev => ({ ...prev, [type]: true, }))
            })
            .catch((error) => {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + error)
            })
    }

    const fetch = () => {
        if (props.listas && props.listas.length > 0) {
            let params = ''
            for (let i = 0; i < props.listas.length; i++) {
                params += (i > 0) ? '&' : ''
                params += props.listas[i]
            }

            ServerRequest(
                REQUEST_METHOD.GET,
                null,
                true,
                APIS.URLS.LISTA,
                `/${params}`,
                null,
                res => onSuccess(res, 'listas'),
                onNoSuccess,
                onError
            )
        }
        else setReadies(prev => ({ ...prev, listas: true, }))

        if (props.entidades && props.entidades.length > 0) {
            let params = ''
            for (let i = 0; i < props.entidades.length; i++) {
                params += (i > 0) ? '&' : ''
                params += props.entidades[i]
            }

            ServerRequest(
                REQUEST_METHOD.GET,
                null,
                true,
                APIS.URLS.ENTIDAD,
                `/${params}`,
                null,
                res => onSuccess(res, 'entidades'),
                onNoSuccess,
                onError
            )
        }
        else setReadies(prev => ({ ...prev, entidades: true, }))
    }

    return [items, readies.listas && readies.entidades]
}

