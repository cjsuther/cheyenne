import React, { useState, useEffect } from 'react';
import { bool, string, number, func } from 'prop-types';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import TasasModal from '../../controls/TasasModal';
import Loading from '../Loading';

import './index.css'


const InputTasa = (props) => {

    const [state, setState] = useState({
        value: null,
        rowSelected: null,
        showList: false,
        loading: false,
    });

    useEffect(() => {

        if (props.value) {
            FindTasa(props.value);
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
    function FindTasa(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });
        
        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                setState(prevState => {
                    return {...prevState, loading: false, value: data.tasa.id, rowSelected: data.tasa };
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
            APIS.URLS.TASA,
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

            <Loading visible={state.loading && !props.hideLoading}></Loading>

            {state.showList && (
                <TasasModal
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
                    name={props.name}
                    type="text"
                    placeholder={props.placeholder}
                    className={`input-tasa ${props.className}`}
                    value={(state.rowSelected) ? `${state.rowSelected.codigo} - ${state.rowSelected.descripcion}` : ''}
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

InputTasa.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: number,
    idTipoTributo: number,
    onChange: func,
    disabled: bool,
    hideLoading: bool,
};

InputTasa.defaultProps = {
    placeholder: "",
    className: "",
    value: null,
    idTipoTributo: null,
    onChange: null,
    disabled: false,
    hideLoading: false,
};

export default InputTasa;
