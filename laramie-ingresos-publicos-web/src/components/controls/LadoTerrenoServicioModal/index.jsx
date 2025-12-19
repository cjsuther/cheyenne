import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { CloneObject } from '../../../utils/helpers';
import ShowToastMessage from '../../../utils/toast';
import DatePickerCustom from '../../common/DatePickerCustom';
import InputEntidad from '../../common/InputEntidad';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import { InputSubTasa, InputTasa } from '../../common';


const LadoTerrenoServicioModal = (props) => {

  const entityInit = {
    id: 0,
    idLadoTerreno: 0,
    idTasa: 0,
    idSubTasa: 0,
    fechaDesde: null,
    fechaHasta: null
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
      fechaDesde: props.data.entity.fechaDesde,
      fechaHasta: props.data.entity.fechaHasta
    })
  }
  useEffect(mount, [props.data.entity]);

  const [ formValues, formHandle, , formSet ] = useForm({
    idTasa: 0,
    idSubTasa: 0,
    fechaDesde: null,
    fechaHasta: null
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.idTasa = parseInt(formValues.idTasa);
      row.idSubTasa = parseInt(formValues.idSubTasa);
      row.fechaDesde = formValues.fechaDesde;
      row.fechaHasta = formValues.fechaHasta;

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.idTasa <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar la Tasa');
      return false;
    }
    if (formValues.idSubTasa <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar la Sub Tasa');
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
            <h2 className="modal-title">Servicio del Lado del Terreno</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
                <div className="mb-3 col-12">
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
                <div className="mb-3 col-12">
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
                <div className="mb-3 col-6 col-md-4">
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
                <div className="mb-3 col-6 col-md-4">
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
                      title="Información adicional de Servicio de Lado del Terreno"
                      processKey={props.processKey}
                      entidad="LadoTerrenoServicio"
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

LadoTerrenoServicioModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

LadoTerrenoServicioModal.defaultProps = {
  disabled: false
};

export default LadoTerrenoServicioModal;