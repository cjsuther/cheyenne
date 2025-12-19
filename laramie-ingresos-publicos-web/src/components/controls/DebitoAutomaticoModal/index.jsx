import React, { useState, useEffect } from 'react';
import { InputLista, InputEntidad, InputMedioPago, DatePickerCustom, InputTasa, InputSubTasa } from '../../common';
import { useForm } from '../../hooks/useForm';
import { object, func, bool, string } from 'prop-types';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import { isEmptyString } from '../../../utils/validator';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerFormRedux from '../DataTaggerFormRedux';


const DebitoAutomaticoModal = (props) => {

    const entityInit = {
        id: 0,
        idCuenta: 0,
        idTasa: 0,
        idSubTasa: 0,
        idRubro: 0,
        idTipoSolicitudDebitoAutomatico: 0,
        numeroSolicitudDebitoAutomatico: '',
        idMedioPago: 0,
        detalleMedioPago: '',
        fechaDesde: null,
        fechaAlta: null,
        fechaBaja: null
    };

    //hooks
    const [state, setState] = useState({
        entity: entityInit,
        showInfo: false
    });

    const [medioPago, setMedioPago] = useState({
        detalleMedioPago: ""
    });

    const mount = () => {
        setState(prevState => {
            return {...prevState, entity: props.data.entity };
        });
        formSet({
            idTasa: props.data.entity.idTasa,
            idSubTasa: props.data.entity.idSubTasa,
            idRubro: props.data.entity.idRubro,
            idTipoSolicitudDebitoAutomatico: props.data.entity.idTipoSolicitudDebitoAutomatico,
            numeroSolicitudDebitoAutomatico: props.data.entity.numeroSolicitudDebitoAutomatico,
            idMedioPago: props.data.entity.idMedioPago,
            fechaDesde: props.data.entity.fechaDesde,
            fechaAlta: props.data.entity.fechaAlta,
            fechaBaja: props.data.entity.fechaBaja
        });
        setMedioPago({
          detalleMedioPago: props.data.entity.detalleMedioPago
        });
    }
    useEffect(mount, [props.data.entity]);

    const [ formValues, formHandle, , formSet ] = useForm({
        idTasa: 0,
        idSubTasa: 0,
        idRubro: 0,
        idTipoSolicitudDebitoAutomatico: 0,
        numeroSolicitudDebitoAutomatico: '',
        idMedioPago: 0,
        fechaDesde: null,
        fechaAlta: null,
        fechaBaja: null
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            let row = CloneObject(state.entity);
            row.idTasa = parseInt(formValues.idTasa);
            row.idSubTasa = parseInt(formValues.idSubTasa);
            row.idRubro = !isEmptyString(formValues.idPersona) ? parseInt(formValues.idRubro) : 0;
            row.idTipoSolicitudDebitoAutomatico = !isEmptyString(formValues.idTipoSolicitudDebitoAutomatico) ? parseInt(formValues.idTipoSolicitudDebitoAutomatico) : 0;
            row.numeroSolicitudDebitoAutomatico = formValues.numeroSolicitudDebitoAutomatico;
            row.idMedioPago = parseInt(formValues.idMedioPago);
            row.detalleMedioPago = medioPago.detalleMedioPago;
            row.fechaDesde = formValues.fechaDesde;
            row.fechaAlta = formValues.fechaAlta;
            row.fechaBaja = formValues.fechaBaja;

            props.onConfirm(row);
        };
    };

    //funciones
    function isFormValid() {

        if (formValues.idTasa <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tasa');
            return false;
        }
        if (formValues.idSubTasa <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Sub Tasa');
            return false;
        }
        if (formValues.idMedioPago <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Medio de Pago');
            return false;
        }
        
        if (formValues.fechaDesde == null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Fecha Desde');
            return false;
        }
        if (formValues.fechaAlta == null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha Alta');
            return false;
        }

        return true;
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
            <h2 className="modal-title">Débitos Automáticos: {(state.entity.id > 0) ? state.entity.detalleMedioPago : "Nuevo"}</h2>
          </div>
          
          <div className="modal-body">
            <div className="row">
    
                <div className="mb-3 col-6">
                    <label htmlFor="idTasa" className="form-label">Tasa</label>
                    <InputTasa
                        name="idTasa"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTasa }
                        onChange={ formHandle }
                        disabled={ props.disabled}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idSubTasa" className="form-label">Sub Tasa</label>
                    <InputSubTasa
                        name="idSubTasa"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idSubTasa }
                        onChange={ formHandle }
                        disabled={ props.disabled}
                        idTasa={formValues.idTasa}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idRubro" className="form-label">Rubro</label>
                    <InputEntidad
                        name="idRubro"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idRubro }
                        onChange={ formHandle }
                        disabled={ props.disabled}
                        title="Rubro"
                        entidad="Rubro"
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
                        disabled={ props.disabled}
                    />
                </div>
                <div className="mb-3 col-12">
                    <label htmlFor="idMedioPago" className="form-label">Medio de Pago</label>
                    <InputMedioPago
                        name="idMedioPago"
                        placeholder=""
                        className="form-control"
                        idCuenta={ state.entity.idCuenta }
                        value={ formValues.idMedioPago }
                        onChange={(event) => {
                          const {target} = event;
                          const medioPago = (target.row) ? {
                              detalleMedioPago: target.row.detalleMedioPago,
                            } : {
                              detalleMedioPago: ""
                            };
                            setMedioPago(medioPago);
                            formHandle(event);
                        }}
                        disabled={ props.disabled }
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="fechaAlta" className="form-label">Fecha alta</label>
                    <DatePickerCustom
                        name="fechaAlta"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaAlta }
                        onChange={ formHandle }
                        disabled={ props.disabled}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="fechaBaja" className="form-label">Fecha baja</label>
                    <DatePickerCustom
                        name="fechaBaja"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaBaja }
                        onChange={ formHandle }
                        disabled={ props.disabled}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idTipoSolicitudDebitoAutomatico" className="form-label">Tipo solicitud</label>
                    <InputLista
                        name="idTipoSolicitudDebitoAutomatico"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoSolicitudDebitoAutomatico }
                        onChange={ formHandle }
                        disabled={ props.disabled}
                        title="Tipo Solicitud de Débitos Automáticos"
                        lista="TipoSolicitudDebitoAutomatico"
                    />
                </div>
                <div className="mb-3 col-6">
                        <label htmlFor="numeroSolicitudDebitoAutomatico" className="form-label">Número solicitud</label>
                        <input
                            name="numeroSolicitudDebitoAutomatico"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numeroSolicitudDebitoAutomatico }
                            onChange={ formHandle }
                            disabled={ props.disabled}
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
                        title="Información adicional de Debitos Automáticos"
                        processKey={props.processKey}
                        entidad="DebitoAutomatico"
                        idEntidad={state.entity.id}
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
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

DebitoAutomaticoModal.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};

DebitoAutomaticoModal.defaultProps = {
    disabled: false
};

export default DebitoAutomaticoModal;
