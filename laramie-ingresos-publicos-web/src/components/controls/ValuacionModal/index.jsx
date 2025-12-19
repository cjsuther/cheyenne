import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { CloneObject, GetMeses } from '../../../utils/helpers';
import { isValidNumber } from '../../../utils/validator';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { useLista } from '../../hooks/useLista';
import ShowToastMessage from '../../../utils/toast';
import InputLista from '../../common/InputLista';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import InputNumber from '../../common/InputNumber';
import InputEjercicio from '../../common/InputEjercicio';


const ValuacionModal = (props) => {

  const entityInit = {
    id: 0,
    idInmueble: 0,
    idTipoValuacion: 0,
    ejercicio: "",
    mes: 0,
    valor: 0,
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
      idTipoValuacion: props.data.entity.idTipoValuacion,
      ejercicio: props.data.entity.ejercicio,
      mes: props.data.entity.mes,
      valor: props.data.entity.valor
    });
  }
  useEffect(mount, [props.data.entity]);

  const [, getRowLista] = useLista({
    listas: ['TipoValuacion'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoValuacion',
      timeout: 0
    }
  });

  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoValuacion: 0,
    ejercicio: "",
    mes: 1,
    valor: 0
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.idTipoValuacion = parseInt(formValues.idTipoValuacion);
      row.ejercicio = formValues.ejercicio;
      row.mes = parseInt(formValues.mes);
      row.valor = formValues.valor;

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.idTipoValuacion <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo Valuacion');
      return false;
    }
    if (!isValidNumber(formValues.ejercicio, true)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Ejercicio');
      return false;
    }
    if (formValues.ejercicio.toString().length !== 4) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar un formato correcto para el campo Ejercicio');
      return false;
    }
    if (formValues.mes <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Mes');
      return false;
    }
    if (!isValidNumber(formValues.valor, true)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Valor');
      return false;
    }

    return true;
  }

  const getDescTipoValuacion = (id) => {
    const row = getRowLista('TipoValuacion', id);
    return (row) ? row.nombre : '';
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
            <h2 className="modal-title">Valuación: {(state.entity.id > 0) ? getDescTipoValuacion(state.entity.idTipoValuacion) : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
                <div className="mb-3 col-12">
                    <label htmlFor="idTipoValuacion" className="form-label">Tipo Valuación</label>
                    <InputLista
                        name="idTipoValuacion"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoValuacion }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        lista="TipoValuacion"
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
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="mes" className="form-label">Mes</label>
                    <select
                        name="mes"
                        placeholder="Tipo"
                        className="form-control"
                        value={ formValues.mes }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    >
                    {GetMeses().map((item, index) =>
                      <option value={item.key} key={index}>{item.value}</option>
                    )}
                    </select>
                </div>
                <div className="mb-3 col-6">
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
                        title="Información adicional de Valuación"
                        processKey={props.processKey}
                        entidad="Valuacion"
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

ValuacionModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

ValuacionModal.defaultProps = {
  disabled: false
};

export default ValuacionModal;