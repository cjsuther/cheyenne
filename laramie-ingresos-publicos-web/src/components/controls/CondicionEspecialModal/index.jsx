import React, { useState, useEffect } from 'react';
import InputEntidad from '../../common/InputEntidad';
import DatePickerCustom from '../../common/DatePickerCustom';
import { useForm } from '../../hooks/useForm';
import { object, func, bool, string } from 'prop-types';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerFormRedux from '../DataTaggerFormRedux';

const CondicionEspecialModal = (props) => {

  const entityInit = {
    id: 0,
    idCuenta: 0,
    idTipoCondicionEspecial: 0,
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
        idTipoCondicionEspecial: props.data.entity.idTipoCondicionEspecial,
        fechaDesde: props.data.entity.fechaDesde,
        fechaHasta: props.data.entity.fechaHasta
      });
    }
    useEffect(mount, [props.data.entity]);
      
    const [ formValues, formHandle, , formSet ] = useForm({
      idTipoCondicionEspecial: 0,
      fechaDesde: null,
      fechaHasta: null 
    });

    const [, getRowEntidad] = useEntidad({
      entidades: ['TipoCondicionEspecial'],
      onLoaded: (entidades, isSuccess, error) => {
        if (isSuccess) {
          setState(prevState => ({...prevState}));
        }
        else {
          ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
        }
      },
      memo: {
        key: 'TipoCondicionEspecial',
        timeout: 0
      }
    });

    //handles
    const handleClickAceptar = () => {
      if (isFormValid()) {
        let row = CloneObject(state.entity);
        row.idTipoCondicionEspecial = parseInt(formValues.idTipoCondicionEspecial);
        row.fechaDesde = formValues.fechaDesde;
        row.fechaHasta = formValues.fechaHasta;

        props.onConfirm(row);
      };
    };

  //funciones
  function isFormValid() {

    if (formValues.idTipoCondicionEspecial <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo Condicion Especial');
      return false;
    }
    if (formValues.fechaDesde == null) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Fecha Desde');
      return false;
    }
    if (formValues.fechaHasta == null) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha Hasta');
      return false;
    }

    return true;
  }

  const getDescTipoCondicionEspecial = (id) => {
    const row = getRowEntidad('TipoCondicionEspecial', id);
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
            <h2 className="modal-title">Condición Especial: {(state.entity.id > 0) ? getDescTipoCondicionEspecial(state.entity.idTipoCondicionEspecial) : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
    
                <div className="mb-3 col-12">
                    <label htmlFor="idTipoCondicionEspecial" className="form-label">Tipo Condición especial</label>
                    <InputEntidad
                        name="idTipoCondicionEspecial"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoCondicionEspecial }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        title="Tipo Condición especial"
                        entidad="TipoCondicionEspecial"
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
                        title="Información adicional de Condición Especial"
                        processKey={props.processKey}
                        entidad="CondicionEspecial"
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

CondicionEspecialModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

CondicionEspecialModal.defaultProps = {
  disabled: false
};

export default CondicionEspecialModal;