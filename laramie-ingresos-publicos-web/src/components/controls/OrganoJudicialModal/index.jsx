import React, { useState, useEffect } from 'react';
import { number, func, bool } from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import { InputCodigo } from '../../common';
import ShowToastMessage from '../../../utils/toast';

const OrganoJudicialModal = (props) => {

    //variables
    const entityInit = {
        id: 0,
        codigoOrganoJudicial: '',
        departamentoJudicial: '',
        fuero: '',
        secretaria: ''
    };

    //hooks
    const [state, setState] = useState({
        loading: false,
        entity: entityInit,
        showInfo: false
    });

    const mount = () => {

        if (props.id > 0) {
            FindOrganoJudicial();
        }
   
        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [ formValues, formHandle, , formSet ] = useForm({
        codigoOrganoJudicial: '',
        departamentoJudicial: '',
        fuero: '',
        secretaria: ''
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            if (props.id == 0) {
                AddOrganoJudicial();
            }
            else {
                ModifyOrganoJudicial();
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

        if (formValues.codigoOrganoJudicial.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Órgano judicial');
            return false;
        }        
        if (formValues.departamentoJudicial.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Departamento judicial');
            return false;
        }
        if (formValues.fuero.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fuero');
            return false;
        }
        if (formValues.secretaria.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Secretaria');
            return false;
        }

        return true;
    }   
    
    function FindOrganoJudicial() {
    
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
                    codigoOrganoJudicial: data.codigoOrganoJudicial,
                    departamentoJudicial: data.departamentoJudicial,
                    fuero: data.fuero,
                    secretaria: data.secretaria
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
            APIS.URLS.ORGANO_JUDICIAL,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }
    
    function AddOrganoJudicial() {
        const method = REQUEST_METHOD.POST;
        const paramsUrl = null;
        SaveOrganoJudicial(method, paramsUrl);
    }
    
    function ModifyOrganoJudicial() {
        const method = REQUEST_METHOD.PUT;
        const paramsUrl = `/${props.id}`;
        SaveOrganoJudicial(method, paramsUrl);
    }    

    function SaveOrganoJudicial(method, paramsUrl) {

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
                codigoOrganoJudicial: formValues.codigoOrganoJudicial,
                departamentoJudicial: formValues.departamentoJudicial,
                fuero: formValues.fuero,
                secretaria: formValues.secretaria
        };
    
        ServerRequest(
            method,
            null,
            true,
            APIS.URLS.ORGANO_JUDICIAL,
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
           <h2 className="modal-title">Organo Judicial: {(props && props.id > 0) ? state.entity.codigoOrganoJudicial : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">

                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="codigoOrganoJudicial" className="form-label">Órgano judicial</label>
                    <InputCodigo
                        name="codigoOrganoJudicial"
                        placeholder=""
                        className="form-control"
                        value={ formValues.codigoOrganoJudicial }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        maxLength={20}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="departamentoJudicial" className="form-label">Departamento judicial</label>
                    <input
                        name="departamentoJudicial"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.departamentoJudicial }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="fuero" className="form-label">Fuero</label>
                    <input
                        name="fuero"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fuero }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="secretaria" className="form-label">Secretaría</label>
                    <input
                        name="secretaria"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.secretaria }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>

            </div>
          </div>
          <div className="modal-footer">
            {!props.disabled &&
            <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() }>Aceptar</button>
            }
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => handleClickCancelar() }>Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

OrganoJudicialModal.propTypes = {
    disabled: bool,
    id: number.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};

OrganoJudicialModal.defaultProps = {
    disabled: false
};

export default OrganoJudicialModal;