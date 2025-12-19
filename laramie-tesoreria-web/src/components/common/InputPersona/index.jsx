import React, { useState, useEffect } from 'react';
import { bool, string, number, func } from 'prop-types';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import PersonasModal from '../../controls/PersonasModal';
import Loading from '../Loading';

import './index.css'


const InputPersona = (props) => {

    const [state, setState] = useState({
        value: null,
        rowSelected: null,
        showList: false,
        loading: false,
    });

    useEffect(() => {

        if (props.value) {
            FindPersona(props.value);
        }
        else {
            setState(prevState => {
                return {...prevState, value: null, rowSelected: null };
            });
        }

    }, [props.value]);

    const [, getRowLista ] = useLista({
        listas: ['TipoDocumento'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {

          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoDocumento',
          timeout: 0
        }
    });

    const getDescTipoDocumento = (id) => {
        const row = getRowLista('TipoDocumento', id);
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
    function FindPersona(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });
        
        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                if (row.idTipoPersona === 500/*PersonaFísica*/) {
                    if (row.fechaNacimiento) row.fechaNacimiento = new Date(row.fechaNacimiento);
                    if (row.fechaDefuncion) row.fechaDefuncion = new Date(row.fechaDefuncion);
                }
                else if (row.idTipoPersona === 501/*PersonaJuridica*/){
                    if (row.fechaConstitucion) row.fechaConstitucion = new Date(row.fechaConstitucion);
                }
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
            APIS.URLS.PERSONA,
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
                <PersonasModal
                    idTipoPersona={props.idTipoPersona}
                    filter={props.filter}
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
                    className={`input-persona ${props.className}`}
                    value={(state.rowSelected && state.rowSelected.idTipoPersona === 500/*PersonaFísica*/) ?
                            `${state.rowSelected.nombre} ${state.rowSelected.apellido} (${getDescTipoDocumento(state.rowSelected.idTipoDocumento)} ${state.rowSelected.numeroDocumento})` :
                        (state.rowSelected && state.rowSelected.idTipoPersona === 501/*PersonaJuridica*/) ?
                            `${state.rowSelected.denominacion} (${getDescTipoDocumento(state.rowSelected.idTipoDocumento)} ${state.rowSelected.numeroDocumento})` : ''
                    }
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

InputPersona.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: number,
    idTipoPersona: number,
    filter: func,
    onUpdate: func,
    onChange: func,
    disabled: bool
};

InputPersona.defaultProps = {
    placeholder: "",
    className: "",
    value: null,
    idTipoPersona: null,
    filter: (row) => { return true },
    onUpdate: null,
    onChange: null,
    disabled: false
};

export default InputPersona;
