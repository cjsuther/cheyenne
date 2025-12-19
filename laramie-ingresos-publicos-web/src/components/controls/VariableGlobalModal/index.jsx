import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { useEntidad } from '../../hooks/useEntidad';
import { DatePickerCustom } from '../../common';
import ShowToastMessage from '../../../utils/toast';
import { isNull } from '../../../utils/validator';
import InputCustom from '../../common/InputCustom';


const VariableGlobalModal = (props) => {

  const entityInit = {
    id: 0,
    idVariable: 0,
    valor: '',
    fechaDesde: null,
    fechaHasta: null
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit,
    showInfo: false
  });

  const [variable, setVariable] = useState({
    id: 0,
    codigo: '',
    descripcion: '',
    tipoDato: '',
    constante: false,
    predefinido: false,
    opcional: true,
    activo: true,
    global: true
  });

  const mount = () => {
    setState(prevState => {
      return {...prevState, entity: props.data.entity };
    });
    formSet({
      valor: props.data.entity.valor,
      fechaDesde: props.data.entity.fechaDesde,
      fechaHasta: props.data.entity.fechaHasta
    });
  }
  useEffect(mount, [props.data.entity]);

  const [, geRowEntidad, readyEntidad] = useEntidad({
    entidades: ['Variable'],
    onLoaded: (entidades, isSuccess, error) => {
      if (!isSuccess) {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'Variable',
      timeout: 0
    }
  });

  useEffect(() => {
    const row = geRowEntidad('Variable', state.entity.idVariable);
    if (row) {
      setVariable(row);
    }
  }, [state.entity.idVariable, readyEntidad]);

  const [ formValues, formHandle, , formSet ] = useForm({
    valor: '',
    fechaDesde: null,
    fechaHasta: null
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.valor = formValues.valor;
      row.fechaDesde = formValues.fechaDesde;
      row.fechaHasta = formValues.fechaHasta;

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (!isNull(formValues.fechaDesde) && !isNull(formValues.fechaHasta) && formValues.fechaDesde > formValues.fechaHasta) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'La fecha desde no puede ser mayor a la fecha hasta');
        return false;
    }
    if (formValues.valor.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Valor');
      return false;
    }

    return true;
  }

  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Variable {`${variable.codigo} (${variable.descripcion})`} {(state.entity.id > 0) ? "" : "(Nuevo valor)"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
              {!variable.constante &&
              <>
              <div className="mb-3 col-6">
                  <label htmlFor="fechaDesde" className="form-label">Fecha Desde</label>
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
                  <label htmlFor="fechaHasta" className="form-label">Fecha Hasta</label>
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
              </>
              }

              {variable.tipoDato.length > 0 &&
              <div className="mb-3 col-12">
                  <label htmlFor="valor" className="form-label">Valor</label>
                  <InputCustom
                      name="valor"
                      type={ variable.tipoDato }
                      placeholder=""
                      className="form-control"
                      value={ formValues.valor }
                      onChange={ formHandle }
                      disabled={props.disabled}
                      serialize={true}
                  />
              </div>
              }

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

VariableGlobalModal.propTypes = {
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

VariableGlobalModal.defaultProps = {
  disabled: false
};

export default VariableGlobalModal;