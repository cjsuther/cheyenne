import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { isEmptyString, isValidNumber, OnKeyPress_validInteger } from '../../../utils/validator';
import ShowToastMessage from '../../../utils/toast';
import { DatePickerCustom, InputLista, InputEntidad, InputPersona, InputExpediente, InputTasa, InputSubTasa } from '../../common';
import DataTaggerFormRedux from '../DataTaggerFormRedux';


const ObraInmuebleModal = (props) => {

  const entityInit = {
    id: 0,
    idInmueble: 0,
    idTasa: 0,
    idSubTasa: 0,
    idTipoMovimiento: 0,
    numero: '',
    cuota: 0,
    fechaPrimerVencimiento: null,
    fechaSegundoVencimiento: null,
    idExpediente: 0,
    detalleExpediente: '',
    idTipoPersona: 0,
    idPersona: 0,
    nombrePersona: '',
    idTipoDocumento: 0,
    numeroDocumento: '',
    fechaPresentacion: null,
    fechaInspeccion: null,
    fechaAprobacion: null,
    fechaInicioDesglose: null,
    fechaFinDesglose: null,
    fechaFinObra: null,
    fechaArchivado: null,
    fechaIntimado: null,
    fechaVencidoIntimado: null,
    fechaMoratoria: null,
    fechaVencidoMoratoria: null
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit,
    showInfo: false
  });
  const [persona, setPersona] = useState({
      idTipoPersona: 0,
      nombrePersona: "",
      numeroDocumento: "",
      idTipoDocumento: 0
  });
  const [expediente, setExpediente] = useState({
    detalleExpediente: ""
  });

  const mount = () => {
    setState(prevState => {
      return {...prevState, entity: props.data.entity}
    });
    setPersona({
        idTipoPersona: props.data.entity.idTipoPersona,
        nombrePersona: props.data.entity.nombrePersona,
        numeroDocumento: props.data.entity.numeroDocumento,
        idTipoDocumento: props.data.entity.idTipoDocumento
    });
    setExpediente({
      detalleExpediente: props.data.entity.detalleExpediente
    });
    formSet({
      idTasa: props.data.entity.idTasa,
      idSubTasa: props.data.entity.idSubTasa,
      idTipoMovimiento: props.data.entity.idTipoMovimiento,
      numero: props.data.entity.numero,
      cuota: props.data.entity.cuota,
      fechaPrimerVencimiento: props.data.entity.fechaPrimerVencimiento,
      fechaSegundoVencimiento: props.data.entity.fechaSegundoVencimiento,
      idExpediente: props.data.entity.idExpediente,
      idPersona: props.data.entity.idPersona,
      fechaPresentacion: props.data.entity.fechaPresentacion,
      fechaInspeccion: props.data.entity.fechaInspeccion,
      fechaAprobacion: props.data.entity.fechaAprobacion,
      fechaInicioDesglose: props.data.entity.fechaInicioDesglose,
      fechaFinDesglose: props.data.entity.fechaFinDesglose,
      fechaFinObra: props.data.entity.fechaFinObra,
      fechaArchivado: props.data.entity.fechaArchivado,
      fechaIntimado: props.data.entity.fechaIntimado,
      fechaVencidoIntimado: props.data.entity.fechaVencidoIntimado,
      fechaMoratoria: props.data.entity.fechaMoratoria,
      fechaVencidoMoratoria: props.data.entity.fechaVencidoMoratoria      
    });
  }
  useEffect(mount, [props.data.entity]);


  const [ formValues, formHandle, , formSet ] = useForm({
    idTasa: 0,
    idSubTasa: 0,
    idTipoMovimiento: 0,
    numero: '',
    cuota: 0,
    fechaPrimerVencimiento: null,
    fechaSegundoVencimiento: null,
    idExpediente: 0,
    idPersona: 0,
    fechaPresentacion: null,
    fechaInspeccion: null,
    fechaAprobacion: null,
    fechaInicioDesglose: null,
    fechaFinDesglose: null,
    fechaFinObra: null,
    fechaArchivado: null,
    fechaIntimado: null,
    fechaVencidoIntimado: null,
    fechaMoratoria: null,
    fechaVencidoMoratoria: null
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);

      row.idTasa = parseInt(formValues.idTasa);
      row.idSubTasa = !isEmptyString(formValues.idSubTasa) ? parseInt(formValues.idSubTasa) : 0;
      row.idTipoMovimiento = parseInt(formValues.idTipoMovimiento);
      row.numero = formValues.numero;
      row.cuota = parseInt(formValues.cuota);
      row.fechaPrimerVencimiento = formValues.fechaPrimerVencimiento;
      row.fechaSegundoVencimiento = formValues.fechaSegundoVencimiento;
      row.idExpediente = !isEmptyString(formValues.idExpediente) ? parseInt(formValues.idExpediente) : 0;
      row.detalleExpediente = expediente.detalleExpediente;
      row.idPersona = parseInt(formValues.idPersona);
      row.idTipoPersona = persona.idTipoPersona;
      row.idTipoDocumento = persona.idTipoDocumento;
      row.numeroDocumento = persona.numeroDocumento;
      row.nombrePersona = persona.nombrePersona;
      row.fechaPresentacion = formValues.fechaPresentacion;
      row.fechaInspeccion = formValues.fechaInspeccion;
      row.fechaAprobacion = formValues.fechaAprobacion;
      row.fechaInicioDesglose = formValues.fechaInicioDesglose;
      row.fechaFinDesglose = formValues.fechaFinDesglose;
      row.fechaFinObra = formValues.fechaFinObra;
      row.fechaArchivado = formValues.fechaArchivado;
      row.fechaIntimado = formValues.fechaIntimado;
      row.fechaVencidoIntimado = formValues.fechaVencidoIntimado;
      row.fechaMoratoria = formValues.fechaMoratoria;
      row.fechaVencidoMoratoria = formValues.fechaVencidoMoratoria;
      
      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.idTasa <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Tasa');
      return false;
    }
    if (formValues.idTipoMovimiento <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Tipo de Movimiento');
      return false;
    }
    if (formValues.numero.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número');
      return false;
    }
    if (!isValidNumber(formValues.cuota, true)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Cuota');
      return false;
    }
    if (formValues.fechaPrimerVencimiento === null) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Primer Vencimiento');
      return false;
    }
    if (formValues.fechaSegundoVencimiento === null) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Segundo Vencimiento');
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
            <h2 className="modal-title">Obra: {(state.entity.id > 0) ? state.entity.numero : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idTasa" className="form-label">Tasa</label>
                    <InputTasa
                        name="idTasa"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTasa }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
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
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="id" className="form-label">Tipo Movimiento</label>
                    <InputEntidad
                        name="idTipoMovimiento"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoMovimiento }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        entidad="TipoMovimiento"
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="numero" className="form-label">Número</label>
                    <input
                        name="numero"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.numero }
                        onChange={ formHandle }
                        onKeyPress={ OnKeyPress_validInteger }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="cuota" className="form-label">Cuota</label>
                    <input
                        name="cuota"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.cuota }
                        onChange={ formHandle }
                        onKeyPress={ OnKeyPress_validInteger }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaPrimerVencimiento" className="form-label">Primer Vencimiento</label>
                    <DatePickerCustom
                        name="fechaPrimerVencimiento"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaPrimerVencimiento }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaSegundoVencimiento" className="form-label">Segundo Vencimiento</label>
                    <DatePickerCustom
                        name="fechaSegundoVencimiento"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaSegundoVencimiento }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>

                <hr className="mb-3"/>
                <div className="mb-3 col-12">
                    <label htmlFor="idExpediente" className="form-label">Expediente</label>
                    <InputExpediente
                        name="idExpediente"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idExpediente }
                        onChange={(event) => {
                            const {target} = event;
                            const expediente = (target.row) ? {
                                detalleExpediente: target.row.detalleExpediente,
                            } : {
                                detalleExpediente: ""
                            };
                            setExpediente(expediente);
                            formHandle(event);
                        }}
                        disabled={props.disabled}
                    />
                </div>

                <hr className="mb-3"/>
                <div className="mb-3 col-12">
                    <label htmlFor="idPersona" className="form-label">Profesional</label>
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

                <hr className="mb-3"/>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaPresentacion" className="form-label">Presentación</label>
                    <DatePickerCustom
                        name="fechaPresentacion"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaPresentacion }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaInspeccion" className="form-label">Inspección</label>
                    <DatePickerCustom
                        name="fechaInspeccion"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaInspeccion }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaAprobacion" className="form-label">Aprobación</label>
                    <DatePickerCustom
                        name="fechaAprobacion"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaAprobacion }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaInicioDesglose" className="form-label">Inicio Desglose</label>
                    <DatePickerCustom
                        name="fechaInicioDesglose"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaInicioDesglose }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaFinDesglose" className="form-label">Fin Desglose</label>
                    <DatePickerCustom
                        name="fechaFinDesglose"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaFinDesglose }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaFinObra" className="form-label">Final Obra</label>
                    <DatePickerCustom
                        name="fechaFinObra"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaFinObra }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaArchivado" className="form-label">Archivado</label>
                    <DatePickerCustom
                        name="fechaArchivado"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaArchivado }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaIntimado" className="form-label">Intimado</label>
                    <DatePickerCustom
                        name="fechaIntimado"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaIntimado }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaVencidoIntimado" className="form-label">Vencido Intimado</label>
                    <DatePickerCustom
                        name="fechaVencidoIntimado"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaVencidoIntimado }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaMoratoria" className="form-label">Moratoria</label>
                    <DatePickerCustom
                        name="fechaMoratoria"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaMoratoria }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-4">
                    <label htmlFor="fechaVencidoMoratoria" className="form-label">Vencido Moratoria</label>
                    <DatePickerCustom
                        name="fechaVencidoMoratoria"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaVencidoMoratoria }
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
                        title="Información adicional de Obra"
                        processKey={props.processKey}
                        entidad="ObraInmueble"
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

ObraInmuebleModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

ObraInmuebleModal.defaultProps = {
  disabled: false
};

export default ObraInmuebleModal;