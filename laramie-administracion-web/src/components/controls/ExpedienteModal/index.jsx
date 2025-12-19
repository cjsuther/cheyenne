import React, { useState, useEffect } from 'react';
import { func, number, bool } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { dataTaggerActionSet, dataTaggerActionClear } from '../../../context/redux/actions/dataTaggerAction';
import { useForm } from '../../hooks/useForm';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';

import { Loading, InputEntidad, InputLista, DatePickerCustom, InputEjercicio } from '../../common';
import { isEmptyString } from '../../../utils/validator';
import { getDateId } from '../../../utils/convert';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerFormRedux from '../DataTaggerFormRedux';


const ExpedienteModal = (props) => {

    //variables
    const entityInit = {
        expediente: {
            id: 0,
            matricula: '',
            ejercicio: '',
            numero: '',
            letra: '',
            idProvincia: 0,
            idTipoExpediente: 0,
            subnumero: '',
            idTemaExpediente: 0,
            referenciaExpediente: '',
            fechaCreacion: null
        },
        archivos: [],
        observaciones: [],
        etiquetas: []
    };

    //hooks
    const [state, setState] = useState({
        loading: false,
        entity: entityInit,
        showInfo: false
    });
    
    const [processKey, setProcessKey] = useState(null);

    const mount = () => {

        const _processKey = `Expediente_${props.id??0}_${getDateId()}`;
        setProcessKey(_processKey);

        if (props.id > 0) {
            FindExpediente();
        }
        else {
            dispatch(dataTaggerActionSet(_processKey, {
                Archivo: [],
                Observacion: [],
                Etiqueta: []
            }));
        }
    
        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    useEffect(() => {
        if (processKey && state.entity.expediente.id > 0) {
            dispatch(dataTaggerActionSet(processKey, {
                Archivo: state.entity.archivos,
                Observacion: state.entity.observaciones,
                Etiqueta: state.entity.etiquetas
            }));        
        }
    }, [processKey, state.entity]);

    const [ formValues, formHandle, , formSet ] = useForm({
        matricula: '',
        ejercicio: '',
        numero: '',
        letra: '',
        idProvincia: 0,
        idTipoExpediente: 0,
        subnumero: '',
        idTemaExpediente: 0,
        referenciaExpediente: '',
        fechaCreacion: null
    });

    const dispatch = useDispatch();
    const dataTagger = useSelector( (state) => state.dataTagger.data );
    
    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            if (props.id == 0) {
                AddExpediente();
            }
            else {
                ModifyExpediente();
            }
        };
    };
    const handleClickCancelar = () => {
        dispatch(dataTaggerActionClear(processKey));
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

        if (formValues.matricula.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Matricula');
            return false;
        }        
        if (formValues.ejercicio.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo  Ejercicio');
            return false;
        }
        if (formValues.numero.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número');
            return false;
        }
        if (formValues.letra.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Letra');
            return false;
        }
        if (formValues.idProvincia <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Provincia');
            return false;
        }   
        if (formValues.idTipoExpediente <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo Expediente');
            return false;
        }               
        if (formValues.subnumero.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Sub número');
            return false;
        }
        if (formValues.fechaCreacion === null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha Creación');
            return false;
        }                

        return true;
    }   
    
    function FindExpediente() {
    
        setState(prevState => {
          return {...prevState, loading: true};
        });
    
        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                if (data.expediente.fechaCreacion) data.expediente.fechaCreacion = new Date(data.expediente.fechaCreacion);
                data.archivos.forEach(x => {
                    if (x.fecha) x.fecha = new Date(x.fecha);
                });
                data.observaciones.forEach(x => {
                    if (x.fecha) x.fecha = new Date(x.fecha);
                });
                
                setState(prevState => {
                  return {...prevState, loading: false, entity: data};
                });
                formSet({
                    matricula: data.expediente.matricula,
                    ejercicio: data.expediente.ejercicio,
                    numero: data.expediente.numero,
                    letra: data.expediente.letra,
                    idProvincia: data.expediente.idProvincia,
                    idTipoExpediente: data.expediente.idTipoExpediente,
                    subnumero: data.expediente.subnumero,
                    idTemaExpediente: data.expediente.idTemaExpediente,
                    referenciaExpediente: data.expediente.referenciaExpediente,
                    fechaCreacion: data.expediente.fechaCreacion                    
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
            APIS.URLS.EXPEDIENTE,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }
    
    function AddExpediente() {
        const method = REQUEST_METHOD.POST;
        const paramsUrl = null;
        SaveExpediente(method, paramsUrl);
    }
    
    function ModifyExpediente() {
        const method = REQUEST_METHOD.PUT;
        const paramsUrl = `/${props.id}`;
        SaveExpediente(method, paramsUrl);
    }    

    function SaveExpediente(method, paramsUrl) {

        setState(prevState => {
          return {...prevState, loading: true};
        });
    
        const callbackSuccess = (response) => {
          response.json()
          .then((row) => {
            setState(prevState => {
                return {...prevState, loading: false};
            });
            dispatch(dataTaggerActionClear(processKey));
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
            expediente: {
                ...state.entity.expediente,
                matricula: formValues.matricula,
                ejercicio: formValues.ejercicio,
                numero: formValues.numero,
                letra: formValues.letra,
                idProvincia: parseInt(formValues.idProvincia),
                idTipoExpediente: parseInt(formValues.idTipoExpediente),
                subnumero: formValues.subnumero,
                idTemaExpediente: !isEmptyString(formValues.idTemaExpediente) ? parseInt(formValues.idTemaExpediente) : 0,
                referenciaExpediente: formValues.referenciaExpediente,
                fechaCreacion: formValues.fechaCreacion
            },
            archivos: (dataTagger[processKey]) ? dataTagger[processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[processKey]) ? dataTagger[processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[processKey]) ? dataTagger[processKey].Etiqueta.filter(f => f.state !== 'o') : []
        };
    
        ServerRequest(
            method,
            null,
            true,
            APIS.URLS.EXPEDIENTE,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }

    function ToggleAccordionInfo() {
        setState(prevState => {
            return {...prevState, showInfo: !prevState.showInfo};
        });
    }
    
    const accordionClose = <i className="fa fa-angle-right"></i>
    const accordionOpen = <i className="fa fa-angle-down"></i>


    return (
        <>

        <Loading visible={state.loading}></Loading>
    
        <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-lg">
            <div className="modal-content animated fadeIn">
              <div className="modal-header">
              <h2 className="modal-title">Expediente: {(props && props.id > 0) ? `${state.entity.expediente.ejercicio}-${state.entity.expediente.numero}-${state.entity.expediente.letra}` : "Nuevo"}</h2>
              </div>
              <div className="modal-body">
                <div className="row">

                    <div className="mb-3 col-6 col-lg-4">
                        <label htmlFor="ejercicio" className="form-label">Ejercicio</label>
                        <InputEjercicio
                            name="ejercicio"
                            placeholder=""
                            className="form-control"
                            value={ formValues.ejercicio }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-lg-4">
                        <label htmlFor="numero" className="form-label">Número</label>
                        <input
                            name="numero"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numero }
                            onChange={ formHandle }
                            disabled={props.disabled} 
                            maxLength="50" 
                        />
                    </div>

                    <div className="mb-3 col-6 col-lg-4">
                        <label htmlFor="letra" className="form-label">Letra</label>
                        <input
                            name="letra"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.letra }
                            onChange={ formHandle }
                            disabled={props.disabled}  
                            maxLength="50"
                        />
                    </div>

                    <div className="mb-3 col-6 col-lg-4">
                        <label htmlFor="matricula" className="form-label">Matricula</label>
                        <input
                            name="matricula"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.matricula }
                            onChange={ formHandle }
                            disabled={props.disabled}  
                            maxLength="50"                          
                        />
                    </div>

                    <div className="mb-3 col-12 col-lg-4">
                        <label htmlFor="idProvincia" className="form-label">Provincia</label>
                        <InputEntidad
                            name="idProvincia"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idProvincia }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            title="Provincia"
                            entidad="Provincia"
                        />
                    </div>

                    <div className="mb-3 col-6 col-lg-4">
                        <label htmlFor="subnumero" className="form-label">Sub número</label>
                        <input
                            name="subnumero"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.subnumero }
                            onChange={ formHandle }
                            disabled={props.disabled}  
                            maxLength="50"
                        />
                    </div>

                    <div className="mb-3 col-6 col-lg-4">
                        <label htmlFor="fechaCreacion" className="form-label">Fecha creación</label>
                        <DatePickerCustom
                            name="fechaCreacion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaCreacion }
                            onChange={ formHandle }
                            disabled={props.disabled}  
                        />
                    </div>

                    <div className="mb-3 col-12 col-lg-8">
                        <label htmlFor="idTipoExpediente" className="form-label">Tipo de expediente</label>
                        <InputLista
                            name="idTipoExpediente"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoExpediente }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="TipoExpediente"
                        />
                    </div>
                    
                    <div className="mb-3 col-12">
                        <label htmlFor="idTemaExpediente" className="form-label">Tema de expediente</label>
                        <InputEntidad
                            name="idTemaExpediente"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTemaExpediente }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            title="Tema de expediente"
                            entidad="TemaExpediente"
                        />
                    </div>

                    <div className="mb-3 col-12">
                        <div className='accordion-header'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordionInfo()}>
                                    <div className='accordion-header-title'>
                                        {(state.showInfo) ? accordionOpen : accordionClose}
                                        <h3 className={state.showInfo ? 'active' : ''}>Información adicional</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {state.showInfo &&
                        <div className='accordion-body'>
                            <DataTaggerFormRedux
                                title="Información adicional de Expediente"
                                processKey={processKey}
                                entidad="Expediente"
                                idEntidad={props.id}
                                disabled={props.disabled}
                            />
                        </div>
                        }
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
    

ExpedienteModal.propTypes = {
    id: number.isRequired,
    disabled: bool,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired
};

ExpedienteModal.defaultProps = {
    disabled: false
};    

export default ExpedienteModal;
