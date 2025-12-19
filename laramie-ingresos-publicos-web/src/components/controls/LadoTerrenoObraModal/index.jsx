import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { CloneObject } from '../../../utils/helpers';
import { isEmptyString } from '../../../utils/validator';
import ShowToastMessage from '../../../utils/toast';
import DatePickerCustom from '../../common/DatePickerCustom';
import InputEntidad from '../../common/InputEntidad';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import InputNumber from '../../common/InputNumber';


const LadoTerrenoObraModal = (props) => {

  const entityInit = {
    id: 0,
    idLadoTerreno: 0,
    idObra: 0,
    importe: 0,
    reduccionMetros: 0,
    reduccionSuperficie: 0,
    fecha: null,
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
      idObra: props.data.entity.idObra,
      importe: props.data.entity.importe,
      reduccionMetros: props.data.entity.reduccionMetros,
      reduccionSuperficie: props.data.entity.reduccionSuperficie,
      fecha: props.data.entity.fecha
    })
  }
  useEffect(mount, [props.data.entity]);

  const [ formValues, formHandle, , formSet ] = useForm({
    idObra: 0,
    importe: 0,
    reduccionMetros: 0,
    reduccionSuperficie: 0,
    fecha: null,
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.idObra = parseInt(formValues.idObra);
      row.importe = formValues.importe;
      row.reduccionMetros = formValues.reduccionMetros;
      row.reduccionSuperficie = formValues.reduccionSuperficie;
      row.fecha = formValues.fecha;

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.idObra <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar la Obra');
      return false;
    }
    if (formValues.fecha === null) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar la fecha');
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
            <h2 className="modal-title">Obra del Lado del Terreno</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
                <div className="mb-3 col-12 col-md-8">
                    <label htmlFor="idObra" className="form-label">Obra</label>
                    <InputEntidad
                        name="idObra"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idObra }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        title="Obra"
                        entidad="Obra"
                        onFormat={(row) => (row) ? row.nombre : ''}
                        columns={[
                          { Header: 'Código', accessor: 'codigo', width: '25%' },
                          { Header: 'Nombre', accessor: 'nombre', width: '55%' },
                          { Header: 'Importe', accessor: 'importe', width: '15%' }
                        ]}
                    />
                </div>
                <div className="mb-3 col-6 col-md-4">
                    <label htmlFor="importe" className="form-label">Importe ($)</label>
                    <InputNumber
                        name="importe"
                        placeholder=""
                        className="form-control"
                        value={ formValues.importe }
                        precision={2}
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-md-4">
                    <label htmlFor="reduccionMetros" className="form-label">Reducción de Metros</label>
                    <InputNumber
                        name="reduccionMetros"
                        placeholder=""
                        className="form-control"
                        value={ formValues.reduccionMetros }
                        precision={2}
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-md-4">
                    <label htmlFor="reduccionSuperficie" className="form-label">Reducción de Superficie</label>
                    <InputNumber
                        name="reduccionSuperficie"
                        placeholder=""
                        className="form-control"
                        value={ formValues.reduccionSuperficie }
                        precision={2}
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6 col-md-4">
                    <label htmlFor="fecha" className="form-label">Fecha</label>
                    <DatePickerCustom
                        name="fecha"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fecha }
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
                    title="Información adicional de Obra de Lado del Terreno"
                    processKey={props.processKey}
                    entidad="LadoTerrenoObra"
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

LadoTerrenoObraModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

LadoTerrenoObraModal.defaultProps = {
  disabled: false
};

export default LadoTerrenoObraModal;