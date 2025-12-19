import React, { useState, useEffect } from 'react';
import { bool, string, number, func } from 'prop-types';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import ExpedientesModal from '../../controls/ExpedientesModal';
import Loading from '../Loading';

import './index.css'


const InputExpediente = (props) => {

    const [state, setState] = useState({
        value: null,
        rowSelected: null,
        showList: false,
        loading: false,
    });

    useEffect(() => {

        if (props.value) {
            FindExpediente(props.value);
        }
        else {
            setState(prevState => {
                return {...prevState, value: null, rowSelected: null };
            });
        }

    }, [props.value]);

    const [, getRowLista ] = useLista({
        listas: ['TipoExpediente'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {

          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoExpediente',
          timeout: 0
        }
    });

    const getDescTipoExpediente = (id) => {
        const row = getRowLista('TipoExpediente', id);
        return (row) ? row.nombre : '';
    }


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
    function FindExpediente(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });
        
        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                setState(prevState => {
                    return {...prevState, loading: false, value: row.id, rowSelected: row };
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
  
        const paramsUrl = `/${id}`;
        
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.EXPEDIENTE,
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
                <ExpedientesModal
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
                    className={`input-expediente ${props.className}`}
                    value={(state.rowSelected) ? `${state.rowSelected.ejercicio}-${state.rowSelected.numero}-${state.rowSelected.letra} (${getDescTipoExpediente(state.rowSelected.idTipoExpediente)})` : ''}
                    onClick={() => {
                        setState(prevState => {
                            return {...prevState, showList: true};
                        });
                    }}
                    readOnly={true}
                    disabled={props.disabled}
                />

                {!props.disabled && <i
                    className="fas fa-times icon-cruz"
                    onClick={() => onSelected(0, null)}
                />}
            </div>

        </>
    )
}

InputExpediente.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: number,
    onChange: func,
    disabled: bool
};

InputExpediente.defaultProps = {
    placeholder: "",
    className: "",
    value: null,
    onChange: null,
    disabled: false
};

export default InputExpediente;
