import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { dataTaggerActionSet, dataTaggerActionClear } from '../../../context/redux/actions/dataTaggerAction';
import { useForm } from '../../hooks/useForm';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import { DatePickerCustom, InputLista, InputEntidad, InputPersona, InputCuenta, InputEjercicio } from '../../common';
import { getDateId } from '../../../utils/convert';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerFormRedux from '../DataTaggerFormRedux';

const CertificadoEscribanoModal = (props) => {

    //variables
    const entityInit = {
        certificadoEscribano: {
            id: 0,
            anioCertificado: '',
            numeroCertificado: '',
            idTipoCertificado: 0,
            idObjetoCertificado: 0,
            idEscribano: 0,
            transferencia: '',
            idCuenta: 0,
            vendedor: '',
            partida: '',
            direccion: '',
            idPersonaIntermediario: 0,
            idTipoPersonaIntermediario: 0,
            nombrePersonaIntermediario: '',
            idTipoDocumentoIntermediario: 0,
            numeroDocumentoIntermediario: '',
            idPersonaRetiro: 0,
            idTipoPersonaRetiro: 0,
            nombrePersonaRetiro: '',
            idTipoDocumentoRetiro: 0,
            numeroDocumentoRetiro: '',
            fechaEntrada: null,
            fechaSalida: null,
            fechaEntrega: null
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

    const [personaIntermediario, setPersonaIntermediario] = useState({
        idTipoPersonaIntermediario: 0,
        nombrePersonaIntermediario: "",
        numeroDocumentoIntermediario: "",
        idTipoDocumentoIntermediario: 0  
    });
    
    const [personaRetiro, setPersonaRetiro] = useState({
        idTipoPersonaRetiro: 0,
        nombrePersonaRetiro: "",
        numeroDocumentoRetiro: "",
        idTipoDocumentoRetiro: 0  
    });

    const [cuenta, setCuenta] = useState({
        vendedor: '',
        partida: '',
        direccion: '',
    });

    const [processKey, setProcessKey] = useState(null);

    const mount = () => {

        const _processKey = `CertificadoEscribano_${props.id??0}_${getDateId()}`;
        setProcessKey(_processKey);

        if (props.id > 0) {
            FindCertificadoEscribano();
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
        if (processKey && state.entity.certificadoEscribano.id > 0) {
            dispatch(dataTaggerActionSet(processKey, {
                Archivo: state.entity.archivos,
                Observacion: state.entity.observaciones,
                Etiqueta: state.entity.etiquetas
            }));        
        }
    }, [processKey, state.entity]);

    const [ formValues, formHandle, , formSet ] = useForm({
        anioCertificado: '',
        numeroCertificado: '',
        idTipoCertificado: 0,
        idObjetoCertificado: 0,
        idEscribano: 0,
        transferencia: '',
        idCuenta: 0,
        idPersonaIntermediario: 0,
        idPersonaRetiro: 0,
        fechaEntrada: null,
        fechaSalida: null,
        fechaEntrega: null
    });

    const dispatch = useDispatch();
    const dataTagger = useSelector( (state) => state.dataTagger.data );

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            if (props.id == 0) {
                AddCertificadoEscribano();
            }
            else {
                ModifyCertificadoEscribano();
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

    // funciones
    function isFormValid() {

        if (formValues.anioCertificado.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Año');
            return false;
        }        
        if (formValues.numeroCertificado.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número de certificado');
            return false;
        }
        if (formValues.idTipoCertificado <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo');
            return false;
        }
        if (formValues.idObjetoCertificado <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Objeto');
            return false;
        }
        if (formValues.idEscribano <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Escribano');
            return false;
        }   
        if (formValues.transferencia.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Transferencia');
            return false;
        }               
        if (formValues.idCuenta <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Cuenta');
            return false;
        }
        if (formValues.idPersonaIntermediario <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Intermediario');
            return false;
        }                
        if (formValues.idPersonaRetiro <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Retiro');
            return false;
        }  

        return true;
    }   

    function FindCuenta(idCuenta) {
        setState(prevState => {
            return {...prevState, loading: true};
        });
    
        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                setState(prevState => {
                return {...prevState, loading: false};
                });
                setCuenta({
                    vendedor: data.vendedor,
                    partida: data.partida,
                    direccion: data.direccion
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
    
        const paramsUrl = `/data/${idCuenta}`;
    
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
    
    function FindCertificadoEscribano() {
    
        setState(prevState => {
          return {...prevState, loading: true};
        });
    
        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                if (data.certificadoEscribano.fechaEntrada) data.certificadoEscribano.fechaEntrada = new Date(data.certificadoEscribano.fechaEntrada);
                if (data.certificadoEscribano.fechaSalida) data.certificadoEscribano.fechaSalida = new Date(data.certificadoEscribano.fechaSalida);
                if (data.certificadoEscribano.fechaEntrega) data.certificadoEscribano.fechaEntrega = new Date(data.certificadoEscribano.fechaEntrega);
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
                    anioCertificado: data.certificadoEscribano.anioCertificado,
                    numeroCertificado: data.certificadoEscribano.numeroCertificado,
                    idTipoCertificado: data.certificadoEscribano.idTipoCertificado,
                    idObjetoCertificado: data.certificadoEscribano.idObjetoCertificado,
                    idEscribano: data.certificadoEscribano.idEscribano,
                    transferencia: data.certificadoEscribano.transferencia,
                    idCuenta: data.certificadoEscribano.idCuenta,
                    vendedor: data.certificadoEscribano.vendedor,
                    partida: data.certificadoEscribano.partida,
                    direccion: data.certificadoEscribano.direccion,
                    idPersonaIntermediario: data.certificadoEscribano.idPersonaIntermediario,
                    idPersonaRetiro: data.certificadoEscribano.idPersonaRetiro,
                    fechaEntrada: data.certificadoEscribano.fechaEntrada,
                    fechaSalida: data.certificadoEscribano.fechaSalida,
                    fechaEntrega: data.certificadoEscribano.fechaEntrega
                });
                setPersonaIntermediario({
                    idTipoPersonaIntermediario: data.certificadoEscribano.idTipoPersonaIntermediario,
                    nombrePersonaIntermediario: data.certificadoEscribano.nombrePersonaIntermediario,
                    numeroDocumentoIntermediario: data.certificadoEscribano.numeroDocumentoIntermediario,
                    idTipoDocumentoIntermediario: data.certificadoEscribano.idTipoDocumentoIntermediario
                });
                setPersonaRetiro({
                    idTipoPersonaRetiro: data.certificadoEscribano.idTipoPersonaRetiro,
                    nombrePersonaRetiro: data.certificadoEscribano.nombrePersonaRetiro,
                    numeroDocumentoRetiro: data.certificadoEscribano.numeroDocumentoRetiro,
                    idTipoDocumentoRetiro: data.certificadoEscribano.idTipoDocumentoRetiro
                });
                setCuenta({
                    vendedor: data.certificadoEscribano.vendedor,
                    partida: data.certificadoEscribano.partida,
                    direccion: data.certificadoEscribano.direccion
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
            APIS.URLS.CERTIFICADO_ESCRIBANO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }
    
    function AddCertificadoEscribano() {
        const method = REQUEST_METHOD.POST;
        const paramsUrl = null;
        SaveCertificadoEscribano(method, paramsUrl);
    }
    
    function ModifyCertificadoEscribano() {
        const method = REQUEST_METHOD.PUT;
        const paramsUrl = `/${props.id}`;
        SaveCertificadoEscribano(method, paramsUrl);
    }    

    function SaveCertificadoEscribano(method, paramsUrl) {

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
            certificadoEscribano: {
                ...state.entity.certificadoEscribano,
                anioCertificado: formValues.anioCertificado,
                numeroCertificado: formValues.numeroCertificado,
                idTipoCertificado: parseInt(formValues.idTipoCertificado),
                idObjetoCertificado: parseInt(formValues.idObjetoCertificado),
                idEscribano: parseInt(formValues.idEscribano),
                transferencia: formValues.transferencia,
                idCuenta: parseInt(formValues.idCuenta),
                vendedor: cuenta.vendedor,
                partida: cuenta.partida,
                direccion: cuenta.direccion,
                idPersonaIntermediario: parseInt(formValues.idPersonaIntermediario),
                idTipoPersonaIntermediario: parseInt(personaIntermediario.idTipoPersonaIntermediario),
                nombrePersonaIntermediario: personaIntermediario.nombrePersonaIntermediario,
                idTipoDocumentoIntermediario: parseInt(personaIntermediario.idTipoDocumentoIntermediario),
                numeroDocumentoIntermediario: personaIntermediario.numeroDocumentoIntermediario,
                idPersonaRetiro: parseInt(formValues.idPersonaRetiro),
                idTipoPersonaRetiro: parseInt(personaRetiro.idTipoPersonaRetiro),
                nombrePersonaRetiro: personaRetiro.nombrePersonaRetiro,
                idTipoDocumentoRetiro: parseInt(personaRetiro.idTipoDocumentoRetiro),
                numeroDocumentoRetiro: personaRetiro.numeroDocumentoRetiro,
                fechaEntrada: formValues.fechaEntrada,
                fechaSalida: formValues.fechaSalida,
                fechaEntrega: formValues.fechaEntrega
            },
            archivos: (dataTagger[processKey]) ? dataTagger[processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[processKey]) ? dataTagger[processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[processKey]) ? dataTagger[processKey].Etiqueta.filter(f => f.state !== 'o') : []
        };
    
        ServerRequest(
            method,
            null,
            true,
            APIS.URLS.CERTIFICADO_ESCRIBANO,
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

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog modal-lg">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Certificado: {(props && props.id > 0) ? state.entity.certificadoEscribano.numeroCertificado : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">

                <div className="mb-3 col-12 col-md-6 col-xl-4">
                    <label htmlFor="anioCertificado" className="form-label">Año</label>
                    <InputEjercicio
                        name="anioCertificado"
                        placeholder=""
                        className="form-control"
                        value={ formValues.anioCertificado }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6 col-xl-4">
                    <label htmlFor="numeroCertificado" className="form-label">Número certificado</label>
                    <input
                        name="numeroCertificado"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.numeroCertificado }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-xl-4">
                    <label htmlFor="fechaEntrada" className="form-label">Fecha entrada</label>
                    <DatePickerCustom
                        name="fechaEntrada"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaEntrada }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idTipoCertificado" className="form-label">Tipo</label>
                    <InputLista
                        name="idTipoCertificado"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoCertificado }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        lista="TipoCertificado"
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idObjetoCertificado" className="form-label">Objeto</label>
                    <InputEntidad
                        name="idObjetoCertificado"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idObjetoCertificado }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        title="Objeto Certificado"
                        entidad="ObjetoCertificado"
                    />
                </div>
                <div className="mb-3 col-12">
                    <label htmlFor="idEscribano" className="form-label">Escribano</label>
                    <InputEntidad
                        name="idEscribano"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idEscribano }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        title="Escribano"
                        entidad="Escribano"
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idCuenta" className="form-label">Cuenta</label>
                    <InputCuenta
                        name="idCuenta"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idCuenta }
                        onChange={({target}) =>{
                            let idCuenta = 0;
                            if (target.row) {
                                idCuenta = parseInt(target.value);
                                FindCuenta(idCuenta);
                            }
                            else {
                                setCuenta({
                                    vendedor: '',
                                    partida: '',
                                    direccion: '',
                                });
                            }
                            formSet({...formValues, idCuenta: idCuenta});
                        }}
                        idTipoTributo={10}
                        disabled={props.disabled}
                    />
                </div> 
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="transferencia" className="form-label">Transferencia</label>
                    <input
                        name="transferencia"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.transferencia }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div> 
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="vendedor" className="form-label">Vendedor</label>
                    <input
                        name="vendedor"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ cuenta.vendedor }
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="partida" className="form-label">Partida</label>
                    <input
                        name="partida"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ cuenta.partida }
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-12">
                    <label htmlFor="direccion" className="form-label">Dirección</label>
                    <input
                        name="direccion"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ cuenta.direccion }
                        disabled={true}
                    />
                </div> 
                <div className="mb-3 col-12">
                    <label htmlFor="idPersonaIntermediario" className="form-label">Intermediario</label>
                    <InputPersona
                        name="idPersonaIntermediario"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idPersonaIntermediario }
                        idTipoPersona={0}
                        onChange={(event) => {
                            const {target} = event;
                            const persona = (target.row) ? {
                              idTipoPersonaIntermediario: target.row.idTipoPersona,
                              idTipoDocumentoIntermediario: target.row.idTipoDocumento,
                              numeroDocumentoIntermediario: target.row.numeroDocumento,
                              nombrePersonaIntermediario: target.row.nombrePersona
                            } : {
                              idTipoPersonaIntermediario: 0,
                              idTipoDocumentoIntermediario: 0,
                              numeroDocumentoIntermediario: "",
                              nombrePersonaIntermediario: ""
                            };
                            setPersonaIntermediario(persona);
                            formHandle(event);
                          }}
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="fechaSalida" className="form-label">Fecha de salida</label>
                    <DatePickerCustom
                        name="fechaSalida"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaSalida }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="fechaEntrega" className="form-label">Fecha de entrega</label>
                    <DatePickerCustom
                        name="fechaEntrega"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaEntrega }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12">
                    <label htmlFor="idPersonaRetiro" className="form-label">Retiró</label>
                    <InputPersona
                        name="idPersonaRetiro"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idPersonaRetiro }
                        idTipoPersona={0}
                        onChange={(event) => {
                            const {target} = event;
                            const persona = (target.row) ? {
                              idTipoPersonaRetiro: target.row.idTipoPersona,
                              idTipoDocumentoRetiro: target.row.idTipoDocumento,
                              numeroDocumentoRetiro: target.row.numeroDocumento,
                              nombrePersonaRetiro: target.row.nombrePersona
                            } : {
                              idTipoPersonaRetiro: 0,
                              idTipoDocumentoRetiro: 0,
                              numeroDocumentoRetiro: "",
                              nombrePersonaRetiro: ""
                            };
                            setPersonaRetiro(persona);
                            formHandle(event);
                          }}
                        disabled={props.disabled}
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
                            title="Información adicional de Certificado Escribano"
                            processKey={processKey}
                            entidad="CertificadoEscribano"
                            idEntidad={props.id}
                            disabled={props.disabled}
                        />
                    </div>
                    }
                </div>

            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() }>Aceptar</button>
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => handleClickCancelar() }>Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

CertificadoEscribanoModal.propTypes = {
    disabled: bool,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};

CertificadoEscribanoModal.defaultProps = {
    disabled: false
};

export default CertificadoEscribanoModal;