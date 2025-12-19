import React, { useState, useEffect, useRef } from 'react';
import { bool, string, number, func } from 'prop-types';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import CuentasModal from '../../controls/CuentasModal';
import Loading from '../Loading';

import './index.css'


const InputCuenta = (props) => {

    const [state, setState] = useState({
        value: null,
        rowSelected: null,
        showList: false,
        loading: false,
    });

    const refInputText = useRef(null);

    useEffect(() => {

        if (props.value) {
            FindCuenta(props.value);
        }
        else {
            setState(prevState => {
                return {...prevState, value: null, rowSelected: null };
            });
        }

    }, [props.value]);

    useEffect(() => {
        if (props.triggerClick > 0) {
            refInputText.current.click();
        }
    }, [props.triggerClick]);

    const [, getRowLista ] = useLista({
        listas: ['TipoTributo'],
        onLoaded: (listas, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoTributo',
          timeout: 0
        }
    });

    const getDescTipoTributo = (id) => {
        const row = getRowLista('TipoTributo', id);
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
    function FindCuenta(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });
        
        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
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
            APIS.URLS.CUENTA,
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
                <CuentasModal
                    idTipoTributo={props.idTipoTributo}
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
                    ref={refInputText}
                    name={props.name}
                    type="text"
                    placeholder={props.placeholder}
                    className={`input-cuenta ${props.className}`}
                    value={(state.rowSelected) ? `${state.rowSelected.numeroCuenta} (${getDescTipoTributo(state.rowSelected.idTipoTributo)})` : ''}
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

InputCuenta.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: number,
    idTipoTributo: number,
    onUpdate: func,
    onChange: func,
    triggerClick: number,
    disabled: bool
};

InputCuenta.defaultProps = {
    placeholder: "",
    className: "",
    value: null,
    idTipoTributo: null,
    onUpdate: null,
    onChange: null,
    triggerClick: 0,
    disabled: false
};

export default InputCuenta;
