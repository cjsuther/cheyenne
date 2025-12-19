import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import { InputCodigo, InputEntidad } from '../../common';
import ShowToastMessage from '../../../utils/toast';

const TipoRelacionCertificadoApremioPersonaModal = (props) => {

    //variables
    const entityInit = {
        id: 0,
        codigo: '',
        descripcion: '',
        idTipoControlador: 0
    };

    //hooks
    const [state, setState] = useState({
        loading: false,
        entity: entityInit,
        showInfo: false
    });

    const mount = () => {

        if (props.id > 0) {
            FindTipoRelacionCertificadoApremioPersona();
        }
   
        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [ formValues, formHandle, , formSet ] = useForm({
        codigo: '',
        descripcion: '',
        idTipoControlador: 0
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            if (props.id == 0) {
                AddTipoRelacionCertificadoApremioPersona();
            }
            else {
                ModifyTipoRelacionCertificadoApremioPersona();
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

    // funciones
    function isFormValid() {

        if (formValues.codigo.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Código');
            return false;
        }        
        if (formValues.descripcion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Descripción');
            return false;
        }

        return true;
    }   
    
    function FindTipoRelacionCertificadoApremioPersona() {
    
        setState(prevState => {
          return {...prevState, loading: true};
        });
    
        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {               
                setState(prevState => {
                  return {...prevState, loading: false, entity: data};
                });
                formSet({
                    codigo: data.codigo,
                    descripcion: data.descripcion,
                    idTipoControlador: data.idTipoControlador
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
            APIS.URLS.TIPO_RELACION_CERTIFICADO_APREMIO_PERSONA,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }
    
    function AddTipoRelacionCertificadoApremioPersona() {
        const method = REQUEST_METHOD.POST;
        const paramsUrl = null;
        SaveTipoRelacionCertificadoApremioPersona(method, paramsUrl);
    }
    
    function ModifyTipoRelacionCertificadoApremioPersona() {
        const method = REQUEST_METHOD.PUT;
        const paramsUrl = `/${props.id}`;
        SaveTipoRelacionCertificadoApremioPersona(method, paramsUrl);
    }    

    function SaveTipoRelacionCertificadoApremioPersona(method, paramsUrl) {

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
                ...state.entity,
                codigo: formValues.codigo,
                descripcion: formValues.descripcion,
                idTipoControlador: formValues.idTipoControlador
        };
    
        ServerRequest(
            method,
            null,
            true,
            APIS.URLS.TIPO_RELACION_CERTIFICADO_APREMIO_PERSONA,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }

    return (
        <>
    
        <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
            <div className="modal-dialog modal-lg">
                <div className="modal-content animated fadeIn">
                <div className="modal-header">
                    <h2 className="modal-title">Tipo relación certificado apremio persona: {(props && props.id > 0) ? state.entity.codigo : "Nuevo"}</h2>
                </div>
                <div className="modal-body">
    
                    <div className="row">
                        <div className="mb-3 col-12 col-md-6">
                            <label htmlFor="codigo" className="form-label">Código</label>
                            <InputCodigo
                                name="codigo"
                                placeholder=""
                                className="form-control"
                                value={ formValues.codigo }
                                onChange={ formHandle }
                                disabled={props.disabled}
                                maxLength={20}
                            />
                        </div>
                        <div className="mb-3 col-12 col-md-6">      
                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                            <input
                                name="descripcion"
                                type="text"
                                placeholder=""
                                className="form-control"
                                value={ formValues.descripcion }
                                onChange={ formHandle }
                                disabled={props.disabled}
                            />
                        </div>
                        <div className="mb-3 col-12">
                            <label htmlFor="idTipoControlador" className="form-label">Tipo Controlador</label>
                            <InputEntidad
                                name="idTipoControlador"
                                placeholder=""
                                className="form-control"
                                value={ formValues.idTipoControlador }
                                onChange={ formHandle }
                                disabled={props.disabled}
                                title="Tipo Controlador"
                                entidad="TipoControlador"
                                onFormat= {(row) => (row) ? `${row.codigo} - ${row.nombre}` : ''}
                                memo={false}
                            />
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

TipoRelacionCertificadoApremioPersonaModal.propTypes = {
    disabled: bool,
    data: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};

TipoRelacionCertificadoApremioPersonaModal.defaultProps = {
    disabled: false
};

export default TipoRelacionCertificadoApremioPersonaModal;