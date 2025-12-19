import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { OPERATION_MODE } from '../../../consts/operationMode';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { useEntidad } from '../../hooks/useEntidad';
import { InputEntidad, InputEjercicio, InputTasa, InputSubTasa, InputLista } from '../../common';
import ShowToastMessage from '../../../utils/toast';
import { isNull } from '../../../utils/validator';
import DataTaggerFormRedux from '../DataTaggerFormRedux';


const SubTasaImputacionModal = (props) => {

  const entityInit = {
    id: 0,
    idTasa: 0,
    idSubTasa: 0,
    ejercicio: '',
    idTipoCuota: 0,
    idCuentaContable: 0,
    idCuentaContableAnterior: 0,
    idCuentaContableFutura: 0,
    idJurisdiccionActual: 0,
    idRecursoPorRubroActual: 0,
    idJurisdiccionAnterior: 0,
    idRecursoPorRubroAnterior: 0,
    idJurisdiccionFutura: 0,
    idRecursoPorRubroFutura: 0,
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
      idTasa: props.data.entity.idTasa,
      idSubTasa: props.data.entity.idSubTasa,
      ejercicio: props.data.entity.ejercicio,
      idTipoCuota: props.data.entity.idTipoCuota,
      idCuentaContable: props.data.entity.idCuentaContable,
      idCuentaContableAnterior: props.data.entity.idCuentaContableAnterior,
      idCuentaContableFutura: props.data.entity.idCuentaContableFutura,
      idJurisdiccionActual: props.data.entity.idJurisdiccionActual,
      idRecursoPorRubroActual: props.data.entity.idRecursoPorRubroActual,
      idJurisdiccionAnterior: props.data.entity.idJurisdiccionAnterior,
      idRecursoPorRubroAnterior: props.data.entity.idRecursoPorRubroAnterior,
      idJurisdiccionFutura: props.data.entity.idJurisdiccionFutura,
      idRecursoPorRubroFutura: props.data.entity.idRecursoPorRubroFutura
    });
  }
  useEffect(mount, [props.data.entity]);

  const [ formValues, formHandle, , formSet ] = useForm({
    idTasa: 0,
    idSubTasa: 0,
    ejercicio: '',
    idTipoCuota: 0,
    idCuentaContable: 0,
    idCuentaContableAnterior: 0,
    idCuentaContableFutura: 0,
    idJurisdiccionActual: 0,
    idRecursoPorRubroActual: 0,
    idJurisdiccionAnterior: 0,
    idRecursoPorRubroAnterior: 0,
    idJurisdiccionFutura: 0,
    idRecursoPorRubroFutura: 0
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.ejercicio = formValues.ejercicio;
      row.idTipoCuota = formValues.idTipoCuota;
      row.idCuentaContable = formValues.idCuentaContable;
      row.idCuentaContableAnterior = formValues.idCuentaContableAnterior;
      row.idCuentaContableFutura = formValues.idCuentaContableFutura;
      row.idJurisdiccionActual = formValues.idJurisdiccionActual;
      row.idRecursoPorRubroActual = formValues.idRecursoPorRubroActual;
      row.idJurisdiccionAnterior = formValues.idJurisdiccionAnterior;
      row.idRecursoPorRubroAnterior = formValues.idRecursoPorRubroAnterior;
      row.idJurisdiccionFutura = formValues.idJurisdiccionFutura;
      row.idRecursoPorRubroFutura = formValues.idRecursoPorRubroFutura;

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.ejercicio.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo ejercicio');
      return false;
    }
    if (formValues.idJurisdiccionActual <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Jurisdicción actual');
      return false;
    }
    if (formValues.idRecursoPorRubroActual <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Recurso por rubro actual');
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
            <h2 className="modal-title">Sub tasa - Imputación </h2>
          </div>

          <div className="modal-body">
            <div className="row">

                <div className="mb-3 col-6">
                    <label htmlFor="idTasa" className="form-label">Tasa</label>
                    <InputTasa
                        name="idTasa"
                        placeholder=""
                        className="form-control"
                        value={formValues.idTasa}
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idSubTasa" className="form-label">Sub tasa</label>
                    <InputSubTasa
                        name="idSubTasa"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idSubTasa }
                        disabled={ true }
                        idTasa={ formValues.idTasa }
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="ejercicio" className="form-label">Ejercicio</label>
                    <InputEjercicio
                        name="ejercicio"
                        placeholder=""
                        className="form-control"
                        value={ formValues.ejercicio }
                        onChange={ formHandle }
                        disabled={ props.disabled }
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idTipoCuota" className="form-label">Tipo cuota</label>
                    <InputLista
                        name="idTipoCuota"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoCuota }
                        onChange={ formHandle }
                        disabled={ props.disabled }
                        title="Tipo de cuota"
                        lista="TipoCuota"
                        showCode={true}
                    />
                </div>
                <div className="mb-3 col-12">
                    <label htmlFor="idCuentaContable" className="form-label">Cuenta</label>
                    <InputEntidad
                        name="idCuentaContable"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idCuentaContable }
                        onChange={ formHandle }
                        disabled={ props.disabled }
                        title="Cuenta actual"
                        entidad="CuentaContable"
                        onFormat= {(row) => (row) ? `${row.agrupamiento} - ${row.nombre}` : ''}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idCuentaContableAnterior" className="form-label">Cuenta anterior</label>
                    <InputEntidad
                        name="idCuentaContableAnterior"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idCuentaContableAnterior }
                        onChange={ formHandle }
                        disabled={ props.disabled }
                        title="Cuenta anterior"
                        entidad="CuentaContable"
                        onFormat= {(row) => (row) ? `${row.agrupamiento} - ${row.nombre}` : ''}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idCuentaContableFutura" className="form-label">Cuenta futura</label>
                    <InputEntidad
                        name="idCuentaContableFutura"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idCuentaContableFutura }
                        onChange={ formHandle }
                        disabled={ props.disabled }
                        title="Cuenta futura"
                        entidad="CuentaContable"
                        onFormat= {(row) => (row) ? `${row.agrupamiento} - ${row.nombre}` : ''}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idJurisdiccionActual" className="form-label">Jurisdicción actual</label>
                    <InputEntidad
                        name="idJurisdiccionActual"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idJurisdiccionActual }
                        onChange={ formHandle }
                        disabled={ props.disabled }
                        title="Jurisdicción actual"
                        entidad="Jurisdiccion"
                        onFormat= {(row) => (row) ? `${row.agrupamiento} - ${row.nombre}` : ''}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idRecursoPorRubroActual" className="form-label">Recurso por rubro actual</label>
                    <InputEntidad
                        name="idRecursoPorRubroActual"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idRecursoPorRubroActual }
                        onChange={ formHandle }
                        disabled={ props.disabled }
                        title="Recurso por rubro actual"
                        entidad="RecursoPorRubro"
                        onFormat= {(row) => (row) ? `${row.agrupamiento} - ${row.nombre}` : ''}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idJurisdiccionAnterior" className="form-label">Jurisdicción anterior</label>
                    <InputEntidad
                        name="idJurisdiccionAnterior"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idJurisdiccionAnterior }
                        onChange={ formHandle }
                        disabled={ props.disabled }
                        title="Jurisdicción anterior"
                        entidad="Jurisdiccion"
                        onFormat= {(row) => (row) ? `${row.agrupamiento} - ${row.nombre}` : ''}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idRecursoPorRubroAnterior" className="form-label">Recurso por rubro anterior</label>
                    <InputEntidad
                        name="idRecursoPorRubroAnterior"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idRecursoPorRubroAnterior }
                        onChange={ formHandle }
                        disabled={ props.disabled }
                        title="Recurso por rubro anterior"
                        entidad="RecursoPorRubro"
                        onFormat= {(row) => (row) ? `${row.agrupamiento} - ${row.nombre}` : ''}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idJurisdiccionFutura" className="form-label">Jurisdicción futura</label>
                    <InputEntidad
                        name="idJurisdiccionFutura"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idJurisdiccionFutura }
                        onChange={ formHandle }
                        disabled={ props.disabled }
                        title="Jurisdicción futura"
                        entidad="Jurisdiccion"
                        onFormat= {(row) => (row) ? `${row.agrupamiento} - ${row.nombre}` : ''}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idRecursoPorRubroFutura" className="form-label">Recurso por rubro futuro</label>
                    <InputEntidad
                        name="idRecursoPorRubroFutura"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idRecursoPorRubroFutura }
                        onChange={ formHandle }
                        disabled={ props.disabled }
                        title="Recurso por rubro futuro"
                        entidad="RecursoPorRubro"
                        onFormat= {(row) => (row) ? `${row.agrupamiento} - ${row.nombre}` : ''}
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
                            title="Información adicional de imputaciones"
                            processKey={props.processKey}
                            entidad="SubTasaImputacion"
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

SubTasaImputacionModal.propTypes = {
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

SubTasaImputacionModal.defaultProps = {
  disabled: false
};

export default SubTasaImputacionModal;