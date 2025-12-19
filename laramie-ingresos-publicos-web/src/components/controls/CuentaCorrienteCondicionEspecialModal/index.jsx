import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';
import { InputEntidad, DatePickerCustom, InputCodigo } from '../../common';
import { useForm } from '../../hooks/useForm';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import { isValidNumber } from '../../../utils/validator';


const CuentaCorrienteCondicionEspecialModal = (props) => {

    //variables
    const entityInit = {
        id: 0,
        numero: '',
        idTipoCondicionEspecial: 0,
        idCuenta: 0,
        numeroPartida: 0,
        codigoDelegacion: '',
        numeroMovimiento : 0,
        numeroComprobante: '',
        fechaDesde: null,
        fechaHasta: null 
    };

    //hooks
    const [state, setState] = useState({
        loading: false,
        entity: entityInit
    });

    useEffect(() => {

        const entity = {...entityInit,
            id: props.data.id,
            idCuenta: props.data.idCuenta,
            numeroPartida: props.data.numeroPartida,
            codigoDelegacion: props.data.codigoDelegacion,
            numeroMovimiento: props.data.numeroMovimiento
        }
        setState(prevState => {
            return {...prevState,
                entity: entity };
        });

        if (props.data.id > 0) {
            FindCondicionEspecial();
        }

    }, [props.data]);

    const [ formValues, formHandle, , formSet ] = useForm({
        numero: '',
        idTipoCondicionEspecial: 0,
        numeroComprobante: '',
        fechaDesde: null,
        fechaHasta: null  
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            if (props.data.id === 0) {
                AddCondicionEspecial();
            }
            else {
                ModifyCondicionEspecial();
            }
        };
    }
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

        if (!isValidNumber(formValues.numero, true)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el número de condición especial');
            return false;
        }
        if (formValues.numeroComprobante.length > 0 && !isValidNumber(formValues.numeroComprobante, false)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar un número de comprobante correcto');
            return false;
        }
        
        if (formValues.idTipoCondicionEspecial <= 0) {
          ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo Condicion Especial');
          return false;
        }
        if (formValues.fechaDesde == null) {
          ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Fecha Desde');
          return false;
        }
        if (formValues.fechaHasta == null) {
          ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha Hasta');
          return false;
        }
    
        return true;
    } 

    function FindCondicionEspecial() {

        setState(prevState => {
          return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                if (data.fechaDesde) data.fechaDesde = new Date(data.fechaDesde);
                if (data.fechaHasta) data.fechaHasta = new Date(data.fechaHasta);

                setState(prevState => {
                  return {...prevState, loading: false, entity: data};
                });
                formSet({
                    numero: data.numero.toString(),
                    idTipoCondicionEspecial: data.idTipoCondicionEspecial,
                    numeroComprobante: data.numeroComprobante.toString(),
                    fechaDesde: data.fechaDesde,
                    fechaHasta: data.fechaHasta
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

        const paramsUrl = `/${props.data.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_CONDICION_ESPECIAL,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function AddCondicionEspecial() {
        const method = REQUEST_METHOD.POST;
        const paramsUrl = null;
        SaveCondicionEspecial(method, paramsUrl);
    }

    function ModifyCondicionEspecial() {
        const method = REQUEST_METHOD.PUT;
        const paramsUrl = `/${props.data.id}`;
        SaveCondicionEspecial(method, paramsUrl);
    }    

    function SaveCondicionEspecial(method, paramsUrl) {

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
            numero: (formValues.numero.length > 0) ? parseInt(formValues.numero) : 0,
            idTipoCondicionEspecial: formValues.idTipoCondicionEspecial,
            numeroComprobante: (formValues.numero.length > 0) ? parseInt(formValues.numeroComprobante) : 0,
            fechaDesde: formValues.fechaDesde,
            fechaHasta: formValues.fechaHasta
        };

        ServerRequest(
            method,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_CONDICION_ESPECIAL,
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
            <div className="modal-dialog">
                <div className="modal-content animated fadeIn">
                <div className="modal-header">
                    <h2 className="modal-title">Condición Especial: {(state.entity.id > 0) ? state.entity.numero : "Nuevo"}</h2>
                </div>
                <div className="modal-body">
                    <div className="row">

                        <div className="mb-3 col-12">
                            <label htmlFor="idTipoCondicionEspecial" className="form-label">Tipo Condición especial</label>
                            <InputEntidad
                                name="idTipoCondicionEspecial"
                                placeholder=""
                                className="form-control"
                                value={ formValues.idTipoCondicionEspecial }
                                onChange={ formHandle }
                                disabled={props.disabled}
                                title="Tipo Condición especial"
                                entidad="TipoCondicionEspecial"
                            />
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="numero" className="form-label">Número Cond. Especial</label>
                            <InputCodigo
                                name="numero"
                                placeholder=""
                                className="form-control"
                                value={ formValues.numero }
                                onChange={ formHandle }
                                disabled={props.disabled}
                            />
                        </div>
                        <div className="mb-3 col-6">
                            <label htmlFor="numeroComprobante" className="form-label">Número Comrprobante</label>
                            <InputCodigo
                                name="numeroComprobante"
                                placeholder=""
                                className="form-control"
                                value={ formValues.numeroComprobante }
                                onChange={ formHandle }
                                disabled={props.disabled}
                            />
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="fechaDesde" className="form-label">Fecha desde</label>
                            <DatePickerCustom
                                name="fechaDesde"
                                placeholder=""
                                className="form-control"
                                value={ formValues.fechaDesde }
                                onChange={ formHandle }
                                disabled={props.disabled}
                            />
                        </div>
                        <div className="mb-3 col-6">
                            <label htmlFor="fechaHasta" className="form-label">Fecha hasta</label>
                            <DatePickerCustom
                                name="fechaHasta"
                                placeholder=""
                                className="form-control"
                                value={ formValues.fechaHasta }
                                onChange={ formHandle }
                                disabled={props.disabled}
                                minValue={formValues.fechaDesde}
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

CuentaCorrienteCondicionEspecialModal.propTypes = {
    disabled: bool,
    data: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
  };
  
  CuentaCorrienteCondicionEspecialModal.defaultProps = {
    disabled: false
  };

export default CuentaCorrienteCondicionEspecialModal;