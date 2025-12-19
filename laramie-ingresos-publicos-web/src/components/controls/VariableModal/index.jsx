import React, { useState, useEffect } from 'react';
import { func, number, bool } from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';

import { Loading, InputLista } from '../../common';
import { isEmptyString } from '../../../utils/validator';
import ShowToastMessage from '../../../utils/toast';
import { GetTipoDatos } from '../../../utils/helpers';


const VariableModal = (props) => {

    //variables
    const entityInit = {
        id: 0,
        codigo: '',
        descripcion: '',
        idTipoTributo: 0,
        tipoDato: '',
        constante: false,
        predefinido: false,
        opcional: true,
        activo: true,
        global: false
    };

    //hooks
    const [state, setState] = useState({
        loading: false,
        showTipoTributo: true,
        entity: entityInit
    });
    
    const mount = () => {

        if (props.id > 0) {
            FindVariable();
        }
    
        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [ formValues, formHandle, , formSet ] = useForm({
        codigo: '',
        descripcion: '',
        idTipoTributo: 0,
        tipoDato: '',
        constante: false,
        predefinido: false,
        opcional: true,
        activo: true,
        global: false
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            if (props.id == 0) {
                AddVariable();
            }
            else {
                ModifyVariable();
            }
        };
    };
    const handleClickCancelar = () => {
        props.onDismiss();
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
    function isFormValid() {

        if (formValues.codigo.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Código');
            return false;
        }
        if (formValues.descripcion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo  Descripción');
            return false;
        }
        if (formValues.tipoDato <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo de dato');
            return false;
        }       

        return true;
    }   
    
    function FindVariable() {
    
        setState(prevState => {
          return {...prevState, loading: true};
        });
    
        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                setState(prevState => {
                  return {...prevState, loading: false, showTipoTributo: !data.global, entity: data};
                });
                formSet({
                    codigo: data.codigo,
                    descripcion: data.descripcion,
                    idTipoTributo: data.idTipoTributo,
                    tipoDato: data.tipoDato,
                    constante: data.constante,
                    predefinido: data.predefinido,
                    opcional: data.opcional,
                    activo: data.activo,
                    global: data.global         
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
    
        const paramsUrl = `/${props.id}`;
    
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.VARIABLE,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }
    
    function AddVariable() {
        const method = REQUEST_METHOD.POST;
        const paramsUrl = null;
        SaveVariable(method, paramsUrl);
    }
    
    function ModifyVariable() {
        const method = REQUEST_METHOD.PUT;
        const paramsUrl = `/${props.id}`;
        SaveVariable(method, paramsUrl);
    }    

    function SaveVariable(method, paramsUrl) {

        setState(prevState => {
          return {...prevState, loading: true};
        });
    
        const callbackSuccess = (response) => {
          response.json()
          .then((row) => {
            setState(prevState => {
                return {...prevState, loading: false};
            });
            props.onConfirm(row.id);
          })
          .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
              return {...prevState, loading: false};
            });
          });
        };
    
        const dataBody = {
            ...state.entity.variable,
            codigo: formValues.codigo,
            descripcion: formValues.descripcion,
            idTipoTributo: !isEmptyString(formValues.idTipoTributo) && !formValues.global ? parseInt(formValues.idTipoTributo) : 0,
            tipoDato: formValues.tipoDato,
            constante: formValues.constante,
            predefinido: formValues.predefinido,
            opcional: formValues.opcional,
            activo: formValues.activo,
            global: formValues.global
        };
    
        ServerRequest(
            method,
            null,
            true,
            APIS.URLS.VARIABLE,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }
    

    return (
        <>

        <Loading visible={state.loading}></Loading>
    
        <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-lg">
            <div className="modal-content animated fadeIn">
              <div className="modal-header">
              <h2 className="modal-title">Variable: {(props && props.id > 0) ? state.entity.codigo : "Nuevo"}</h2>
              </div>
              <div className="modal-body">
                <div className="row">

                    <div className="mb-3 col-12 col-lg-4">
                        <label htmlFor="codigo" className="form-label">Código</label>
                        <input
                            name="codigo"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.codigo }
                            onChange={ formHandle }
                            disabled={props.disabled} 
                            maxLength="50" 
                        />
                    </div>

                    <div className="mb-3 col-12 col-lg-8">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <input
                            name="descripcion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.descripcion }
                            onChange={ formHandle }
                            disabled={props.disabled}  
                            maxLength="250"
                        />
                    </div>

                    <div className="mb-3 col-12 col-lg-4">
                        <label htmlFor="tipoDato" className="form-label">Tipo de dato</label>
                        <select
                            name="tipoDato"
                            placeholder=""
                            className="form-control"
                            value={ formValues.tipoDato }
                            onChange={({ target }) => {
                                formSet({...formValues, tipoDato: target.value});
                            }}
                            disabled={props.disabled}
                        >
                        {GetTipoDatos(true).map((item, index) =>
                          <option value={item.key} key={index}>{item.value}</option>
                        )}
                        </select>
                    </div>

                    <div className="mb-3 col-12 col-lg-4">
                        <label htmlFor="constante" className="form-label">Tipo de parámetro</label>
                        <select
                            name="constante"
                            placeholder=""
                            className="form-control"
                            value={ formValues.constante }
                            onChange={({ target }) => {
                                const eventCustom= {
                                    target: {
                                        name: 'constante',
                                        type: 'checkbox',
                                        checked: (target.value === "true")
                                    }
                                };
                                formHandle(eventCustom);
                            }}
                            disabled={props.disabled}
                        >
                            <option value="false">Variable</option>
                            <option value="true">Constante</option>
                        </select>
                    </div>

                    { state.showTipoTributo && (
                    <div className="mb-3 col-12 col-lg-4">
                        <label htmlFor="idTipoTributo" className="form-label">Tipo de tributo</label>
                        <InputLista
                            name="idTipoTributo"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoTributo }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="TipoTributo"
                            textItemZero="[Todos los tributos]"
                        />
                    </div>
                    )}

                </div>
                <div className="row">
                    
                    <div className="mb-3 col-4 col-lg-2 offset-lg-2 form-check">
                        <label htmlFor="predefinido" className="form-check-label">Predefinido</label>
                        <input
                            name="predefinido"
                            type="checkbox"
                            className="form-check-input"
                            value={''}
                            checked={formValues.predefinido}
                            onChange={({ target }) => {
                                formSet({...formValues, predefinido: target.checked, opcional: true});
                            }}
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-4 col-lg-2 form-check">
                        <label htmlFor="opcional" className="form-check-label">Opcional</label>
                        <input
                            name="opcional"
                            type="checkbox"
                            className="form-check-input"
                            value={''}
                            checked={formValues.opcional}
                            onChange={formHandle}
                            disabled={props.disabled || !formValues.predefinido}
                        />
                    </div>
                    
                    <div className="mb-3 col-4 col-lg-2 form-check">
                        <label htmlFor="activo" className="form-check-label">Activo</label>
                        <input
                            name="activo"
                            type="checkbox"
                            className="form-check-input"
                            value={''}
                            checked={formValues.activo}
                            onChange={formHandle}
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-4 col-lg-2 form-check">
                        <label htmlFor="global" className="form-check-label">Global</label>
                        <input
                            name="global"
                            type="checkbox"
                            className="form-check-input"
                            value={''}
                            checked={formValues.global}
                            onChange={ (e) => {
                                setState(prevState => {
                                    return {...prevState, showTipoTributo: !e.target.checked};
                                });

                                formHandle(e)
                            }}
                            disabled={props.disabled}
                        />
                    </div>
                </div>
              </div>
              
              <div className="modal-footer">
                {!props.disabled &&
                <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() } >Aceptar</button>
                }
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => handleClickCancelar() }>Cancelar</button>
              </div>

            </div>
          </div>
        </div>
    
        </>
      );
    }
    

VariableModal.propTypes = {
    id: number.isRequired,
    disabled: bool,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired
};

VariableModal.defaultProps = {
    disabled: false
};    

export default VariableModal;
