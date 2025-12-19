import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import ShowToastMessage from '../../../utils/toast';
import { DatePickerCustom, InputPersona } from '../../common';
import DataTaggerFormRedux from '../DataTaggerFormRedux';


const EdesurClienteModal = (props) => {

  const entityInit = {
    id: 0,
    idEdesur: 0,
    idPersona: 0,
    idTipoPersona: 0,
    nombrePersona: "",
    idTipoDocumento: 0,
    numeroDocumento: "",
    codigoCliente: "",
    fechaDesde: null,
    fechaHasta: null,
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit,
    showInfo: false
  });
  const [persona, setPersona] = useState({
    idTipoPersona: 0,
    nombrePersona: "",
    idTipoDocumento: 0,
    numeroDocumento: ""
  });

  const mount = () => {
    setState(prevState => {
      return {...prevState, entity: props.data.entity };
    });
    setPersona({
      idTipoPersona: props.data.entity.idTipoPersona,
      nombrePersona: props.data.entity.nombrePersona,
      idTipoDocumento: props.data.entity.idTipoDocumento,
      numeroDocumento: props.data.entity.numeroDocumento,
    });
    formSet({
      idPersona: props.data.entity.idPersona,
      codigoCliente: props.data.entity.codigoCliente,
      fechaDesde: props.data.entity.fechaDesde,
      fechaHasta: props.data.entity.fechaHasta
    });
  }
  useEffect(mount, [props.data.entity]);

  const [ formValues, formHandle, , formSet ] = useForm({
    idPersona: 0,
    codigoCliente: "",
    fechaDesde: null,
    fechaHasta: null
  });

  // Handlers
  
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);

      row.idPersona = parseInt(formValues.idPersona);
      row.idTipoPersona = persona.idTipoPersona;
      row.nombrePersona = persona.nombrePersona;
      row.idTipoDocumento = persona.idTipoDocumento;
      row.numeroDocumento = persona.numeroDocumento;
      row.codigoCliente = formValues.codigoCliente;
      row.fechaDesde = formValues.fechaDesde;
      row.fechaHasta = formValues.fechaHasta;

      props.onConfirm(row);
    };
  };

  // Funciones
  function isFormValid() {

    if (formValues.idPersona <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar la Persona');
      return false;
    }
    if (formValues.codigoCliente.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar un código de cliente.');
      return false;
    }
    if (formValues.fechaDesde === null) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar la fecha Desde');
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
            <h2 className="modal-title">Cliente Edesur: {(state.entity.id > 0) ? state.entity.codigoCliente : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">

                <div className="mb-3 col-6">
                    <label htmlFor="idPersona" className="form-label">Persona</label>
                    <InputPersona
                        name="idPersona"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idPersona }
                        idTipoPersona={0}
                        onChange={(event) => {
                          const {target} = event;
                          const persona = (target.row) ? {
                            idTipoPersona: target.row.idTipoPersona,
                            idTipoDocumento: target.row.idTipoDocumento,
                            numeroDocumento: target.row.numeroDocumento,
                            nombrePersona: target.row.nombrePersona
                          } : {
                            idTipoPersona: 0,
                            idTipoDocumento: 0,
                            numeroDocumento: "",
                            nombrePersona: ""
                          };
                          setPersona(persona);
                          formHandle(event);
                        }}
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="codigoCliente" className="form-label">Código de Cliente</label>
                    <input
                        name="codigoCliente"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.codigoCliente }
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
                    title="Información adicional de Cliente de Edesur"
                    processKey={props.processKey}
                    entidad="EdesurCliente"
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
              <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() }>Aceptar</button>
            }
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

EdesurClienteModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

EdesurClienteModal.defaultProps = {
  disabled: false
};

export default EdesurClienteModal;