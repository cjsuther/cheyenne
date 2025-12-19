import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { isValidNumber } from '../../../utils/validator';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import ShowToastMessage from '../../../utils/toast';
import InputLista from '../../common/InputLista';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import InputNumber from '../../common/InputNumber';


const ObraInmuebleDetalleModal = (props) => {

  const entityInit = {
    id: 0,
    idObraInmueble: 0,
    idTipoObra: 0,
    idDestinoObra: 0,
    idFormaPresentacionObra: 0,
    idFormaCalculoObra: 0,
    sujetoDemolicion: false,
    generarSuperficie: false,
    tipoSuperficie: '',
    descripcion: '',
    valor: 0,
    alicuota: 0,
    metros: 0,
    montoPresupuestado: 0,
    montoCalculado: 0   
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit,
    showInfo: false
  });

  const mount = () => {
    setState(prevState => {
      return {...prevState, entity: props.data.entity };
    });
    formSet({
      idTipoObra: props.data.entity.idTipoObra,
      idDestinoObra: props.data.entity.idDestinoObra,
      idFormaPresentacionObra: props.data.entity.idFormaPresentacionObra,
      idFormaCalculoObra: props.data.entity.idFormaCalculoObra,
      sujetoDemolicion: props.data.entity.sujetoDemolicion,
      generarSuperficie: props.data.entity.generarSuperficie,
      tipoSuperficie: props.data.entity.tipoSuperficie,
      descripcion: props.data.entity.descripcion,
      valor: props.data.entity.valor,
      alicuota: props.data.entity.alicuota,
      metros: props.data.entity.metros,
      montoPresupuestado: props.data.entity.montoPresupuestado,
      montoCalculado: props.data.entity.montoCalculado  
    });
  }
  useEffect(mount, [props.data.entity]);

  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoObra: 0,
    idDestinoObra: 0,
    idFormaPresentacionObra: 0,
    idFormaCalculoObra: 0,
    sujetoDemolicion: false,
    generarSuperficie: false,
    tipoSuperficie: '',
    descripcion: '',
    valor: 0,
    alicuota: 0,
    metros: 0,
    montoPresupuestado: 0,
    montoCalculado: 0
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.idTipoObra = parseInt(formValues.idTipoObra);
      row.idDestinoObra = parseInt(formValues.idDestinoObra);
      row.idFormaPresentacionObra = parseInt(formValues.idFormaPresentacionObra);
      row.idFormaCalculoObra = parseInt(formValues.idFormaCalculoObra);
      row.sujetoDemolicion = formValues.sujetoDemolicion;
      row.generarSuperficie = formValues.generarSuperficie;
      row.tipoSuperficie = formValues.tipoSuperficie;
      row.descripcion = formValues.descripcion;
      row.valor = formValues.valor;
      row.alicuota = formValues.alicuota;
      row.metros = formValues.metros;
      row.montoPresupuestado = formValues.montoPresupuestado;
      row.montoCalculado = formValues.montoCalculado;      

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.idTipoObra <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo de Obra');
      return false;
    }
    if (formValues.idDestinoObra <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Destino');
      return false;
    }
    if (formValues.idFormaPresentacionObra <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Forma de Presentación');
      return false;
    }
    if (formValues.idFormaCalculoObra <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Forma de Cálculo');
      return false;
    }

    if (formValues.tipoSuperficie.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Tipo de Superficie');
      return false;
    }
    if (formValues.descripcion.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Descripción');
      return false;
    }

    if (!isValidNumber(formValues.valor, true)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Valor');
      return false;
    }
    if (!isValidNumber(formValues.alicuota, true)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Alicuota (%)');
      return false;
    }
    if (!isValidNumber(formValues.metros, true)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Metros');
      return false;
    }
    if (!isValidNumber(formValues.montoPresupuestado, true)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Monto Presupuestado ($)');
      return false;
    }
    if (!isValidNumber(formValues.montoCalculado, true)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Monto Calculado ($)');
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
            <h2 className="modal-title">Obra Detalle: {(state.entity.id > 0) ? state.entity.tipoSuperficie : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
              <div className="mb-3 col-12 col-md-6">
                  <label htmlFor="idTipoObra" className="form-label">Tipo Obra</label>
                  <InputLista
                      name="idTipoObra"
                      placeholder=""
                      className="form-control"
                      value={ formValues.idTipoObra }
                      onChange={ formHandle }
                      disabled={props.disabled}
                      lista="TipoObra"
                  />
              </div>
              <div className="mb-3 col-12 col-md-6">
                  <label htmlFor="idDestinoObra" className="form-label">Destino Obra</label>
                  <InputLista
                      name="idDestinoObra"
                      placeholder=""
                      className="form-control"
                      value={ formValues.idDestinoObra }
                      onChange={ formHandle }
                      disabled={props.disabled}
                      lista="DestinoObra"
                  />
              </div>
              <div className="mb-3 col-12 col-md-6">
                  <label htmlFor="idFormaPresentacionObra" className="form-label">Forma Presentación</label>
                  <InputLista
                      name="idFormaPresentacionObra"
                      placeholder=""
                      className="form-control"
                      value={ formValues.idFormaPresentacionObra }
                      onChange={ formHandle }
                      disabled={props.disabled}
                      lista="FormaPresentacionObra"
                  />
              </div>
              <div className="mb-3 col-12 col-md-6">
                  <label htmlFor="idFormaCalculoObra" className="form-label">Forma Cálculo</label>
                  <InputLista
                      name="idFormaCalculoObra"
                      placeholder=""
                      className="form-control"
                      value={ formValues.idFormaCalculoObra }
                      onChange={ formHandle }
                      disabled={props.disabled}
                      lista="FormaCalculoObra"
                  />
              </div>

              <hr className="mb-3"/>
              <div className="mb-3 col-6 form-check">
                  <label htmlFor="sujetoDemolicion" className="form-check-label">Sujeto Demolición</label>
                  <input
                      name="sujetoDemolicion"
                      type="checkbox"
                      className="form-check-input"
                      value={''}
                      checked={formValues.sujetoDemolicion }
                      onChange={ formHandle }
                      disabled={props.disabled}
                  />
              </div>
              <div className="mb-3 col-6 form-check">
                  <label htmlFor="generarSuperficie" className="form-check-label">Generar Superficie</label>
                  <input
                      name="generarSuperficie"
                      type="checkbox"
                      className="form-check-input"
                      value={''}
                      checked={formValues.generarSuperficie }
                      onChange={ formHandle }
                      disabled={props.disabled}
                  />
              </div>

              <hr className="mb-3"/>
              <div className="mb-3 col-12">
                  <label htmlFor="tipoSuperficie" className="form-label">Tipo Superficie</label>
                  <input
                      name="tipoSuperficie"
                      type="text"
                      placeholder=""
                      className="form-control"
                      value={ formValues.tipoSuperficie }
                      onChange={ formHandle }
                      disabled={props.disabled}
                  />
              </div>
              <div className="mb-3 col-12">
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

              <hr className="mb-3"/>
              <div className="mb-3 col-6 col-md-4">
                  <label htmlFor="valor" className="form-label">Valor ($)</label>
                  <InputNumber
                      name="valor"
                      placeholder=""
                      className="form-control"
                      value={ formValues.valor }
                      precision={2}
                      onChange={ formHandle }
                      disabled={props.disabled}
                  />
              </div>
              <div className="mb-3 col-6 col-md-4">
                  <label htmlFor="alicuota" className="form-label">Alicuota (%)</label>
                  <InputNumber
                      name="alicuota"
                      placeholder=""
                      className="form-control"
                      value={ formValues.alicuota }
                      precision={2}
                      onChange={ formHandle }
                      disabled={props.disabled}
                  />
              </div>
              <div className="mb-3 col-6 col-md-4">
                  <label htmlFor="metros" className="form-label">Metros</label>
                  <InputNumber
                      name="metros"
                      placeholder=""
                      className="form-control"
                      value={ formValues.metros }
                      precision={2}
                      onChange={ formHandle }
                      disabled={props.disabled}
                  />
              </div>
              <div className="mb-3 col-6 col-md-4">
                  <label htmlFor="montoPresupuestado" className="form-label">Monto Presupuestado ($)</label>
                  <InputNumber
                      name="montoPresupuestado"
                      placeholder=""
                      className="form-control"
                      value={ formValues.montoPresupuestado }
                      precision={2}
                      onChange={ formHandle }
                      disabled={props.disabled}
                  />
              </div>
              <div className="mb-3 col-6 col-md-4">
                  <label htmlFor="montoCalculado" className="form-label">Monto Cálculado ($)</label>
                  <InputNumber
                      name="montoCalculado"
                      placeholder=""
                      className="form-control"
                      value={ formValues.montoCalculado }
                      precision={2}
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
                      title="Información adicional de Obra Detalle"
                      processKey={props.processKey}
                      entidad="ObraInmuebleDetalle"
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

ObraInmuebleDetalleModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

ObraInmuebleDetalleModal.defaultProps = {
  disabled: false
};

export default ObraInmuebleDetalleModal;