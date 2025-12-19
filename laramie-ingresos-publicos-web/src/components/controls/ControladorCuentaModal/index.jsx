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

const ControladorCuentaModal = (props) => {

  const entityInit = {
    id: 0,
    idCuenta: 0,
    idTipoControlador: 0,
    idControlador: 0,
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
      idTipoControlador: props.data.entity.idTipoControlador,
      idControlador: props.data.entity.idControlador,
      fechaDesde: props.data.entity.fechaDesde,
      fechaHasta: props.data.entity.fechaHasta
    });
  }
  useEffect(mount, [props.data.entity]);
    
  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoControlador: 0,
    idControlador: 0,
    fechaDesde: null,
    fechaHasta: null 
  });

  const [, getRowEntidad] = useEntidad({
    entidades: ['TipoControlador'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoControlador',
      timeout: 0
    }
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {
      let row = CloneObject(state.entity);
      row.idTipoControlador = parseInt(formValues.idTipoControlador);
      row.idControlador = parseInt(formValues.idControlador);
      row.fechaDesde = formValues.fechaDesde;
      row.fechaHasta = formValues.fechaHasta;

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.idControlador <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Controlador');
      return false;
    }

    return true;
  }

  const getDescTipoControlador = (id) => {
    const row = getRowEntidad('TipoControlador', id);
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
            <h2 className="modal-title">Controlador de la Cuenta: {(state.entity.id > 0) ? getDescTipoControlador(state.entity.idTipoControlador) : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
    
                <div className="mb-3 col-12">
                    <label htmlFor="idTipoControlador" className="form-label">Tipo Controlador</label>
                    <InputEntidad
                        name="idTipoControlador"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoControlador }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        title="Tipo Controlador"
                        entidad="TipoControlador"
                        onFormat= {(row) => (row) ? `${row.codigo} - ${row.nombre}` : ''}
                    />
                </div>

                <div className="mb-3 col-12">
                    <label htmlFor="idControlador" className="form-label">Controlador</label>
                    <InputEntidad
                        name="idControlador"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idControlador }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        title="Controlador"
                        entidad="Controlador"
                        onFormat={(row) => (row && row.id) ? `${row.nombrePersona} (Legajo: ${row.legajo})` : ''}
                        filter={(row) => { return (formValues.idTipoControlador === 0 || row.idTipoControlador === formValues.idTipoControlador); }}
                        columns={[
                            { Header: 'Legajo', accessor: 'legajo', width: '25%' },
                            { Header: 'Nombre y Apellido', accessor: 'nombrePersona', width: '70%' }
                        ]}
                        memo={false}
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
                        title="Información adicional de Controladores de la Cuenta"
                        processKey={props.processKey}
                        entidad="ControladorCuenta"
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

ControladorCuentaModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

ControladorCuentaModal.defaultProps = {
  disabled: false
};

export default ControladorCuentaModal;