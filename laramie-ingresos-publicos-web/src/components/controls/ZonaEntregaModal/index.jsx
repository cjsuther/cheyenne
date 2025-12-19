import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { useEntidad } from '../../hooks/useEntidad';
import ShowToastMessage from '../../../utils/toast';
import InputEntidad from '../../common/InputEntidad';
import DireccionForm, {GetDataDireccion, IsValidDireccion} from '../DireccionForm';
import DataTaggerFormRedux from '../DataTaggerFormRedux';


const ZonaEntregaModal = (props) => {

  const direccionInit = {
    id: props.data.entity.direccion.id,
    entidad: "ZonaEntrega",
    idEntidad: props.data.entity.direccion.idTemporal,
    idTipoGeoreferencia: props.data.entity.direccion.idTipoGeoreferencia,
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

  const entityInit = {
    id: 0,
    idCuenta: 0,
    idTipoControlador: 0,
    email: "",
    direccion: direccionInit
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit,
    showInfo: false
  });

  const [tipoControladorState, setTipoControladorState] = useState({
    isValidTipoControlador: false,
    isEmail: false,
  });

  const mount = () => {
    setState(prevState => {
      return {...prevState, entity: props.data.entity };
    });
    formSet({
      idTipoControlador: props.data.entity.idTipoControlador,
      email: props.data.entity.email,
      direccion: props.data.entity.direccion,
    });
  }

  useEffect(mount, [props.data.entity]);

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

  const [ formValues, formHandle, formReset , formSet ] = useForm({
    idTipoControlador: 0,
    email: "",
    direccion: direccionInit
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.idTipoControlador = parseInt(formValues.idTipoControlador);
      
      row.direccion = !tipoControladorState.isEmail ? GetDataDireccion.get("ZonaEntrega_direccion")() : direccionInit;  
      row.email = tipoControladorState.isEmail ? formValues.email : "";

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.idTipoControlador <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Tipo Controlador');
      return false;
    }

    if (tipoControladorState.isEmail && formValues.email.length <= 0){
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Email');
      return false;
    }
   
    if  (!tipoControladorState.isEmail && tipoControladorState.isValidTipoControlador) {
      const isValidDireccion = IsValidDireccion.get("ZonaEntrega_direccion")();
      if (!isValidDireccion.result) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, isValidDireccion.message);
        return false;  
      }
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

  function ValidateTipoControlador(entity){
    if (entity.target && entity.target.row) {
      if (entity.target.row.email || entity.target.row.direccion) {
        setTipoControladorState(prevState => ({...prevState, isEmail: entity.target.row.email, isValidTipoControlador: true}));
      } else {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "El tipo de controlador no es válido");
        setTipoControladorState(prevState => ({...prevState, isEmail: false, isValidTipoControlador: false}));
        formReset();
      }
    }
  }

  const accordionClose = <i className="fa fa-angle-right"></i>
  const accordionOpen = <i className="fa fa-angle-down"></i>  

  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog modal-lg">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Zona de Entrega: {(state.entity.id > 0) ? getDescTipoControlador(state.entity.idTipoControlador) : "Nuevo"}</h2>
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
                        title="Tipo de Controlador"
                        entidad="TipoControlador"
                        onFormat= {(row) => (row) ? `${row.codigo} - ${row.nombre}` : ''}
                        onUpdate= { ValidateTipoControlador }
                    />
                </div>

                { tipoControladorState.isValidTipoControlador && !tipoControladorState.isEmail && 
                  <div className="mb-3 col-12">
                    <DireccionForm
                      id="ZonaEntrega_direccion"
                      data={{
                        entity: formValues.direccion
                      }}
                      disabled={props.disabled}
                      initFormEdit={(state.entity.direccion.id === 0 && state.entity.direccion.latitud === 0 && state.entity.direccion.longitud === 0)}
                    />
                  </div>
                }

                { tipoControladorState.isValidTipoControlador && tipoControladorState.isEmail &&
                  <div className="mb-3 col-12">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        name="email"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.email }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                  </div>
                }

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
                        title="Información adicional de Zona Entrega"
                        processKey={props.processKey}
                        entidad="ZonaEntrega"
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

ZonaEntregaModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

ZonaEntregaModal.defaultProps = {
  disabled: false
};

export default ZonaEntregaModal;