import React, { useState, useEffect } from 'react';
import { bool, string, number, func } from 'prop-types';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import MediosPagoModal from '../../controls/MediosPagoModal';
import Loading from '../Loading';

import './index.css'


const InputMedioPago = (props) => {

    const [state, setState] = useState({
        value: null,
        rowSelected: null,
        showList: false,
        loading: false,
    });

    useEffect(() => {

        if (props.value) {
            FindMedioPago(props.value);
        }
        else {
            setState(prevState => {
                return {...prevState, value: null, rowSelected: null };
            });
        }

    }, [props.value]);

    const [, getRowLista ] = useLista({
        listas: ['TipoMedioPago'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {

          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoMedioPago',
          timeout: 0
        }
    });

    const getDescTipoMedioPago = (id) => {
        const row = getRowLista('TipoMedioPago', id);
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
    function FindMedioPago(id) {

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
            APIS.URLS.MEDIO_PAGO,
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
                <MediosPagoModal
                    idCuenta={props.idCuenta}
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
                    className={`input-medio-pago ${props.className}`}
                    value={(state.rowSelected) ? `${getDescTipoMedioPago(state.rowSelected.idTipoMedioPago)} - Número: ${state.rowSelected.numero} (${state.rowSelected.titular})` : ''}
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

InputMedioPago.propTypes = {
    idCuenta: number.isRequired,
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: number,
    onChange: func,
    disabled: bool
};

InputMedioPago.defaultProps = {
    placeholder: "",
    className: "",
    value: null,
    onChange: null,
    disabled: false
};

export default InputMedioPago;
