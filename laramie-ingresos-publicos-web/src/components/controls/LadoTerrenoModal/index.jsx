import React, { useState, useEffect, useRef } from 'react';
import { object, func, bool, string } from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { OnKeyPress_validInteger, isValidNumber } from '../../../utils/validator';
import ShowToastMessage from '../../../utils/toast';
import InputLista from '../../common/InputLista';
import DireccionForm from '../DireccionForm';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import InputNumber from '../../common/InputNumber';

const LadoTerrenoModal = (props) => {

  const entityInit = {
    id: 0,
    idInmueble: 0,
    idTipoLado: 0,
    numero: 0,
    metros: 0,
    reduccion: 0,
    direccion: {
      id: 0,
      entidad: "LadoTerreno",
      idEntidad: 0,
      idTipoGeoreferencia: 0,
      idPais: 0,
      idProvincia: 0,
      idLocalidad: 0,
      idZonaGeoreferencia: 0,
      codigoPostal: "",
      calle: "",
      entreCalle1: "",
      entreCalle2: "",
      altura: "",
      piso: "",
      dpto: "",
      referencia: "",
      longitud: 0,
      latitud: 0
    }
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
      idTipoLado: props.data.entity.idTipoLado,
      numero: props.data.entity.numero,
      metros: props.data.entity.metros,
      reduccion: props.data.entity.reduccion
    });
  }
  useEffect(mount, [props.data.entity]);


  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoLado: 0,
    numero: '',
    metros: 0,
    reduccion: 0
  });

  const direccionFormRef = useRef()

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.idTipoLado = parseInt(formValues.idTipoLado);
      row.numero = parseInt(formValues.numero);
      row.metros = formValues.metros;
      row.reduccion = formValues.reduccion;

      row.direccion = direccionFormRef.current.getDataDireccion()

      props.onConfirm(row);
    };
  };
  
  //funciones
  function isFormValid() {

    if (formValues.idTipoLado <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Tipo');
      return false;
    }
    if (!isValidNumber(formValues.numero, true)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número');
      return false;
    }

    const data = direccionFormRef.current.getDataDireccion()
    if (
      formValues.idTipoLado === 40 ||
      data.altura ||
      data.calle ||
      data.codigoPostal ||
      data.dpto ||
      data.entreCalle1 ||
      data.entreCalle2 ||
      data.idPais ||
      data.idProvincia ||
      data.piso
    ) {
      const isValidDireccion = direccionFormRef.current.isValidDireccion()
      if (!isValidDireccion.result) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, isValidDireccion.message);
        return false;
      }
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
            <h2 className="modal-title">Lado del Terreno: {(state.entity.id > 0) ? state.entity.numero : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="idTipoLado" className="form-label">Tipo</label>
                    <InputLista
                        name="idTipoLado"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoLado }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        lista="TipoLado"
                    />
                </div>
                <div className="mb-3 col-6 col-lg-3">
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
                <div className="mb-3 col-6 col-lg-3">
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
                <div className="mb-3 col-6 col-lg-3">
                    <label htmlFor="reduccion" className="form-label">Reducción</label>
                    <InputNumber
                        name="reduccion"
                        placeholder=""
                        className="form-control"
                        value={ formValues.reduccion }
                        precision={2}
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>

                <div className="mb-3 col-12">
                  <DireccionForm
                    ref={direccionFormRef}
                    data={{
                      entity: state.entity.direccion
                    }}
                    disabled={props.disabled}
                    initFormEdit={(state.entity.direccion.id === 0 && state.entity.direccion.latitud === 0 && state.entity.direccion.longitud === 0)}
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
                        title="Información adicional de Lado del Terreno"
                        processKey={props.processKey}
                        entidad="LadoTerreno"
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

LadoTerrenoModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

LadoTerrenoModal.defaultProps = {
  disabled: false
};

export default LadoTerrenoModal;