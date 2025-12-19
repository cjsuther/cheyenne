import React, { useState, useEffect } from 'react';
import { object, func, bool, string} from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { isEmptyString, isValidNumber, isValidPercent } from '../../../utils/validator';
import ShowToastMessage from '../../../utils/toast';
import { DatePickerCustom, InputNumber, InputLista, InputEntidad, InputPersona } from '../../common';
import DataTaggerFormRedux from '../DataTaggerFormRedux';

const VinculoInmuebleModal = (props) => {

  const entityInit = {
    id: 0,
    idInmueble: 0,
    idTipoVinculoInmueble: 0,
    idPersona: 0,
    idTipoPersona: 0,
    idTipoDocumento: 0,
    numeroDocumento: "",
    nombrePersona: "",
    idTipoInstrumento: 0,
    fechaInstrumentoDesde: null,
    fechaInstrumentoHasta: null,
    porcentajeCondominio: 0
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit,
    showInfo: false
  });
  const [persona, setPersona] = useState({
    idTipoPersona: 0,
    idTipoDocumento: 0,
    numeroDocumento: "",
    nombrePersona: ""
  });

  const mount = () => {
    setState(prevState => {
      return {...prevState, entity: props.data.entity}
    });
    setPersona({
        idTipoPersona: props.data.entity.idTipoPersona,
        idTipoDocumento: props.data.entity.idTipoDocumento,
        numeroDocumento: props.data.entity.numeroDocumento,
        nombrePersona: props.data.entity.nombrePersona
    });
    formSet({
      idTipoVinculoInmueble: props.data.entity.idTipoVinculoInmueble,
      idPersona: props.data.entity.idPersona,
      idTipoInstrumento: props.data.entity.idTipoInstrumento,
      fechaInstrumentoDesde: props.data.entity.fechaInstrumentoDesde,
      fechaInstrumentoHasta: props.data.entity.fechaInstrumentoHasta,
      porcentajeCondominio: props.data.entity.porcentajeCondominio
    });
  }
  useEffect(mount, [props.data.entity]);


  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoVinculoInmueble: 0,
    idPersona: 0,
    idTipoInstrumento: 0,
    fechaInstrumentoDesde: null,
    fechaInstrumentoHasta: null,
    porcentajeCondominio: 0
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.idTipoVinculoInmueble = parseInt(formValues.idTipoVinculoInmueble);
      row.idPersona = parseInt(formValues.idPersona);
      row.idTipoPersona = persona.idTipoPersona;
      row.idTipoDocumento = persona.idTipoDocumento;
      row.numeroDocumento = persona.numeroDocumento;
      row.nombrePersona = persona.nombrePersona;
      row.idTipoInstrumento = !isEmptyString(formValues.idTipoInstrumento) ? parseInt(formValues.idTipoInstrumento) : 0;
      row.fechaInstrumentoDesde = formValues.fechaInstrumentoDesde;
      row.fechaInstrumentoHasta = formValues.fechaInstrumentoHasta;
      row.porcentajeCondominio = formValues.porcentajeCondominio;

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.idTipoVinculoInmueble <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Tipo Vínculo Inmueble');
      return false;
    }
    if (formValues.idPersona <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Persona');
      return false;
    }
    if (!isValidNumber(formValues.porcentajeCondominio, false)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Porcentaje Condominio');
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
            <h2 className="modal-title">Persona del Inmueble: {(state.entity.id > 0) ? state.entity.nombreApellido : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idTipoVinculoInmueble" className="form-label">Tipo Vínculo</label>
                    <InputLista
                        name="idTipoVinculoInmueble"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoVinculoInmueble }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        lista="TipoVinculoInmueble"
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
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
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idTipoInstrumento" className="form-label">Tipo Instrumento</label>
                    <InputEntidad
                        name="idTipoInstrumento"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoInstrumento }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        title="Tipo de Instrumento"
                        entidad="TipoInstrumento"
                        onFormat={(row) => (row) ? row.nombre : ''}
                        columns={[
                          { Header: 'Nombre', accessor: 'nombre', width: '95%' }
                        ]}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="fechaInstrumentoDesde" className="form-label">Presentación Instrumento</label>
                    <DatePickerCustom
                        name="fechaInstrumentoDesde"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaInstrumentoDesde }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="fechaInstrumentoHasta" className="form-label">Vigencia Hasta</label>
                    <DatePickerCustom
                        name="fechaInstrumentoHasta"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaInstrumentoHasta }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        minValue={formValues.fechaInstrumentoDesde}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="porcentajeCondominio" className="form-label">Condominio (%)</label>
                    <InputNumber
                        name="porcentajeCondominio"
                        placeholder=""
                        className="form-control"
                        value={ formValues.porcentajeCondominio }
                        precision={2}
                        validation={isValidPercent}
                        onChange={ formHandle }
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
                        title="Información adicional de Vínculo Inmueble"
                        processKey={props.processKey}
                        entidad="VinculoInmueble"
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

VinculoInmuebleModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

VinculoInmuebleModal.defaultProps = {
  disabled: false
};

export default VinculoInmuebleModal;