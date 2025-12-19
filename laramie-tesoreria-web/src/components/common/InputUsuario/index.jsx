import React, { useState, useEffect } from 'react';
import { bool, string, number, func } from 'prop-types';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import UsuariosModal from '../../controls/UsuariosModal';
import Loading from '../Loading';

import './index.css'


const InputUsuario = (props) => {

    const [state, setState] = useState({
        value: null,
        rowSelected: null,
        showList: false,
        loading: false,
    });

    useEffect(() => {

        if (props.value) {
            FindUsuario(props.value);
        }
        else {
            setState(prevState => {
                return {...prevState, value: null, rowSelected: null };
            });
        }

    }, [props.value]);

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
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackError = (error) => {
        const message = 'Error procesando solicitud: ' + error.message;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        setState(prevState => {
            return {...prevState, loading: false};
        });
    }


    //funciones
    function FindUsuario(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });
        
        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                if (row.fechaAlta) row.fechaAlta = new Date(row.fechaAlta);
                setState(prevState => {
                    return {...prevState, loading: false, value: row.id, rowSelected: row };
                });
                if (props.onUpdate) {
                    props.onUpdate({
                        target: {
                            name: props.name,
                            type: 'entidad',
                            value: row.id,
                            row: row
                        }
                    });
                }
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };
  
        const paramsUrl = `/${id}`;
        
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

    const onSelected = (id, row) => {
        if (props.onChange) {
            props.onChange({
                target: {
                    name: props.name,
                    type: 'entidad',
                    value: id,
                    row: row
                }
            });
        }
        setState(prevState => {
            return {...prevState, showList: false};
        });
    }
    
    return (
        <>

            <Loading visible={state.loading}></Loading>

            {state.showList && (
                <UsuariosModal
                    onDismiss={() => {
                        setState(prevState => {
                            return {...prevState, showList: false};
                        });
                    }}
                    onConfirm={onSelected}
                    onClickRow={onSelected}
                />
            )}

            <div className='wrapper'>
                <input
                    name={props.name}
                    type="text"
                    placeholder={props.placeholder}
                    className={`input-usuario ${props.className}`}
                    value={(state.rowSelected) ? `${state.rowSelected.codigo} - ${state.rowSelected.nombreApellido} (${state.rowSelected.email})` : ''}
                    onClick={() => {
                        setState(prevState => {
                            return {...prevState, showList: true};
                        });
                    }}
                    readOnly={true}
                    disabled={props.disabled}
                />
                {!props.disabled && <span
                    className="material-symbols-outlined icon-cruz"
                    onClick={() => onSelected(0, null)}
                    >close</span>}
            </div>

        </>
    )
}

InputUsuario.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: number,
    onUpdate: func,
    onChange: func,
    disabled: bool
};

InputUsuario.defaultProps = {
    placeholder: "",
    className: "",
    value: null,
    onUpdate: null,
    onChange: null,
    disabled: false
};

export default InputUsuario;
