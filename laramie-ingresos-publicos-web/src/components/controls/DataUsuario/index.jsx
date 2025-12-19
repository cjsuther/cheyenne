import React, { useState, useEffect } from 'react';
import { func, array } from 'prop-types';
import ShowToastMessage from '../../../utils/toast';
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { ServerRequest } from '../../../utils/apiweb';


const DataUsuario = (props) => {

    //hooks
    const [state, setState] = useState({
        loading: false
    });

    const mount = () => {

    }
    useEffect(mount, [props]);

    useEffect(() => {
        if (props.data.length > 0)
            FindUsuarios();

    }, [props.data]);


    //callbacks
    const callbackNoSuccess = (response) => {
        response.json()
        .then((error) => {
            const message = error.message;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        });
    }

    const callbackError = (error) => {
        const message = 'Error procesando solicitud: ' + error.message;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        setState(prevState => {
            return {...prevState, loading: false};
        });
    }

    //function
    const FindUsuarios = () => {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {

                if (props.onChange){
                    props.onChange(data);
                }

                setState(prevState => {
                    return {...prevState, loading: false};
                });                
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };


        const paramsUrl = `/ids`;
        const dataBody = {
            ids: props.data
        };

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.USUARIO,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    }

    return (
        <>
        </>
    );
}

DataUsuario.propTypes = {
    data: array,
    onChange: func
  };
  
DataUsuario.defaultProps = {
    data: []
};
  
export default DataUsuario;
