import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { isValidNumber, isEmptyString } from '../../../utils/validator';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import ShowToastMessage from '../../../utils/toast';
import InputLista from '../../common/InputLista';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import InputNumber from '../../common/InputNumber';


const EdesurModal = (props) => {

  const entityInit = {
    id: 0,
    idInmueble: 0,
    ultPeriodoEdesur: "",
    ultCuotaEdesur: "",
    ultImporteEdesur: 0,
    medidor: "",
    idFrecuenciaFacturacion: 0,
    plan: "",
    radio: "",
    manzana: "",
    idAnteriorEdesur: "",
    tarifa: 0,
    tarifa1: 0,
    claseServicio: "",
    porcDesc: 0,
    cAnual: "",
    recorrido: "",
    planB: "",
    lzEdesur: false,
    facturarABL: false,
    facturar: false,
    facturarEdesur: false,
    comuna: "",
    calleEdesur: "",
    numeroEdesur: ""
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
      ultPeriodoEdesur: props.data.entity.ultPeriodoEdesur,
      ultCuotaEdesur: props.data.entity.ultCuotaEdesur,
      ultImporteEdesur: props.data.entity.ultImporteEdesur,
      medidor: props.data.entity.medidor,
      idFrecuenciaFacturacion: props.data.entity.idFrecuenciaFacturacion,
      plan: props.data.entity.plan,
      radio: props.data.entity.radio,
      manzana: props.data.entity.manzana,
      idAnteriorEdesur: props.data.entity.idAnteriorEdesur,
      tarifa: props.data.entity.tarifa,
      tarifa1: props.data.entity.tarifa1,
      claseServicio: props.data.entity.claseServicio,
      porcDesc: props.data.entity.porcDesc,
      cAnual: props.data.entity.cAnual,
      recorrido: props.data.entity.recorrido,
      planB: props.data.entity.planB,
      lzEdesur: props.data.entity.lzEdesur,
      facturarABL: props.data.entity.facturarABL,
      facturar: props.data.entity.facturar,
      facturarEdesur: props.data.entity.facturarEdesur,
      comuna: props.data.entity.comuna,
      calleEdesur: props.data.entity.calleEdesur,
      numeroEdesur: props.data.entity.numeroEdesur
    });
  }
  useEffect(mount, [props.data.entity]);

  const [ formValues, formHandle, , formSet ] = useForm({
    ultPeriodoEdesur: "",
    ultCuotaEdesur: "",
    ultImporteEdesur: 0,
    medidor: "",
    idFrecuenciaFacturacion: 0,
    plan: "",
    radio: "",
    manzana: "",
    idAnteriorEdesur: "",
    tarifa: 0,
    tarifa1: 0,
    claseServicio: "",
    porcDesc: 0,
    cAnual: "",
    recorrido: "",
    planB: "",
    lzEdesur: false,
    facturarABL: false,
    facturar: false,
    facturarEdesur: false,
    comuna: "",
    calleEdesur: "",
    numeroEdesur: ""
  });

  // Handlers
  
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.ultPeriodoEdesur = formValues.ultPeriodoEdesur;
      row.ultCuotaEdesur = formValues.ultCuotaEdesur;
      row.ultImporteEdesur = formValues.ultImporteEdesur;
      row.medidor = formValues.medidor;
      row.idFrecuenciaFacturacion = parseInt(formValues.idFrecuenciaFacturacion);
      row.plan = formValues.plan;
      row.radio = formValues.radio;
      row.manzana = formValues.manzana;
      row.idAnteriorEdesur = formValues.idAnteriorEdesur;
      row.tarifa = formValues.tarifa;
      row.tarifa1 = formValues.tarifa1;
      row.claseServicio = formValues.claseServicio;
      row.porcDesc = formValues.porcDesc;
      row.cAnual = formValues.cAnual;
      row.recorrido = formValues.recorrido;
      row.planB = formValues.planB;
      row.lzEdesur = formValues.lzEdesur;
      row.facturarABL = formValues.facturarABL;
      row.facturar = formValues.facturar;
      row.facturarEdesur = formValues.facturarEdesur;
      row.comuna = formValues.comuna;
      row.calleEdesur = formValues.calleEdesur;
      row.numeroEdesur = formValues.numeroEdesur;

      props.onConfirm(row);
    };
  };

  // Funciones
  function isFormValid() {

    if (formValues.medidor.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el identificador del medidor.');
      return false;
    }
    if (formValues.idFrecuenciaFacturacion <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar la frecuencia de facturación.');
      return false;
    }

    if (!isValidNumber(formValues.ultImporteEdesur, false)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Importe');
      return false;
    }
    if (!isValidNumber(formValues.tarifa, false)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Tarifa');
      return false;
    }
    if (!isValidNumber(formValues.tarifa1, false)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Tarifa 1');
      return false;
    }
    if (!isValidNumber(formValues.porcDesc, false)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Porcentaje descuento');
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
      <div className="modal-dialog modal-xl">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Cliente Edesur: {(state.entity.id > 0) ? `Nro. Medidor: ${state.entity.medidor}` : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
              <div className="row">

                <div className="col-12">
                    <label className="form-label" >Última factura:</label>
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="ultPeriodoEdesur" className="form-label">Período</label>
                    <input
                        name="ultPeriodoEdesur"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.ultPeriodoEdesur }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="ultCuotaEdesur" className="form-label">Cuota</label>
                    <input
                        name="ultCuotaEdesur"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.ultCuotaEdesur }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="ultImporteEdesur" className="form-label">Importe ($)</label>
                    <InputNumber
                        name="ultImporteEdesur"
                        placeholder=""
                        className="form-control"
                        value={formValues.ultImporteEdesur }
                        precision={2}
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>

              </div>
              <hr className="solid m-bottom-10"></hr>
              <div className="row">

                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="medidor" className="form-label">Medidor</label>
                    <input
                        name="medidor"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.medidor }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="idFrecuenciaFacturacion" className="form-label">Frecuencia de facturación</label>
                    <InputLista
                        name="idFrecuenciaFacturacion"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idFrecuenciaFacturacion }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        lista="FrecuenciaFacturacion"
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="plan" className="form-label">Plan</label>
                    <input
                        name="plan"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.plan }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                  <label htmlFor="radio" className="form-label">Radio</label>
                    <input
                        name="radio"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.radio }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="manzana" className="form-label">Manzana</label>
                    <input
                        name="manzana"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.manzana }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="idAnteriorEdesur" className="form-label">ID Anterior</label>
                    <input
                        name="idAnteriorEdesur"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.idAnteriorEdesur }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="tarifa" className="form-label">Tarifa ($)</label>
                    <InputNumber
                        name="tarifa"
                        placeholder=""
                        className="form-control"
                        value={formValues.tarifa }
                        precision={2}
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="tarifa1" className="form-label">Tarifa 1 ($)</label>
                    <InputNumber
                        name="tarifa1"
                        placeholder=""
                        className="form-control"
                        value={formValues.tarifa1 }
                        precision={2}
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="comuna" className="form-label">Comuna</label>
                    <input
                        name="comuna"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.comuna }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="calleEdesur" className="form-label">Calle</label>
                    <input
                        name="calleEdesur"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.calleEdesur }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="numeroEdesur" className="form-label">Número</label>
                    <input
                        name="numeroEdesur"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.numeroEdesur }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="claseServicio" className="form-label">Clase Servicio</label>
                    <input
                        name="claseServicio"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.claseServicio }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="porcDesc" className="form-label">Descuento (%)</label>
                    <InputNumber
                        name="porcDesc"
                        placeholder=""
                        className="form-control"
                        value={formValues.porcDesc }
                        precision={2}
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="cAnual" className="form-label">C. Anual</label>
                    <input
                        name="cAnual"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.cAnual }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>

              </div>
              <div className="row">

                <div className="mb-3 col-6">
                    <label htmlFor="recorrido" className="form-label">Recorrido</label>
                    <input
                        name="recorrido"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.recorrido }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="planB" className="form-label">Plan B</label>
                    <input
                        name="planB"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={formValues.planB }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3 form-check">
                    <label htmlFor="lzEdesur" className="form-check-label">LZ</label>
                    <input
                        name="lzEdesur"
                        type="checkbox"
                        className="form-check-input"
                        value={''}
                        checked={formValues.lzEdesur }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3 form-check">
                    <label htmlFor="facturarABL" className="form-check-label">Facturar ABL</label>
                    <input
                        name="facturarABL"
                        type="checkbox"
                        className="form-check-input"
                        value={''}
                        checked={formValues.facturarABL }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3 form-check">
                    <label htmlFor="facturar" className="form-check-label">Facturar</label>
                    <input
                        name="facturar"
                        type="checkbox"
                        className="form-check-input"
                        value={''}
                        checked={formValues.facturar }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3 form-check">
                    <label htmlFor="facturarEdesur" className="form-check-label">Facturar Edesur</label>
                    <input
                        name="facturarEdesur"
                        type="checkbox"
                        className="form-check-input"
                        value={''}
                        checked={formValues.facturarEdesur }
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
                    title="Información adicional de Edesur"
                    processKey={props.processKey}
                    entidad="Edesur"
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

EdesurModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

EdesurModal.defaultProps = {
  disabled: false
};

export default EdesurModal;