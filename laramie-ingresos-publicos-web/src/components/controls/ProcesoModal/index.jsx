import React, { useState, useEffect } from 'react';
import { DatePickerCustom, InputLista, InputNumber  } from '../../common';
import { useForm } from '../../hooks/useForm';
import { object, func, bool } from 'prop-types';
import { CloneObject } from '../../../utils/helpers';
import { PROCESO_STATE } from '../../../consts/procesoState';


const ProcesoModal = (props) => {

  const entityInit = {
    id: 0,
    identificador: "",
    entidad: "",
    idEstadoProceso: 0,
    fechaProceso: null,
    fechaInicio: null,
    fechaFin: null,
    descripcion: "",
    observacion: "",
    avance: 0,
    origen: "",
    idUsuarioCreacion: "",
    fechaCreacion: null,
    urlEjecucion: ""
  };

    //hooks
    const [state, setState] = useState({
      entity: entityInit
    });

    const mount = () => {
      setState(prevState => {
        return {...prevState, entity: props.proceso };
      });
      formSet({
        fechaProceso: props.proceso.fechaProceso
      });
    }
    useEffect(mount, [props.proceso]);
      
    const [ formValues, formHandle, , formSet ] = useForm({
      fechaProceso: null 
    });

    //handles
    const handleClickAceptar = () => {
      if (props.onConfirm) {
        let row = CloneObject(state.entity);
        row.idEstadoProceso = PROCESO_STATE.PENDIENTE;
        row.fechaProceso = formValues.fechaProceso;
        props.onConfirm(row);
      }
    };

    const handleClickCancel = () => {
      if (props.onCancel) {
        let row = CloneObject(state.entity);
        row.idEstadoProceso = PROCESO_STATE.CANCELADO;
        props.onCancel(row);
      }
    }


  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog modal-lg">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Proceso: {(state.entity.id > 0) ? state.entity.descripcion : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
    
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <input
                        name="descripcion"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ state.entity.descripcion }
                        disabled={true}
                    />
                </div>
                {(state.entity.id > 0) &&
                <>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idEstadoProceso" className="form-label">Estado</label>
                    <InputLista
                        name="idEstadoProceso"
                        placeholder=""
                        className="form-control"
                        value={ state.entity.idEstadoProceso }
                        lista="EstadoProceso"
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="avance" className="form-label">Avance (%)</label>
                    <InputNumber
                        name="avance"
                        placeholder=""
                        className="form-control"
                        value={ state.entity.avance }
                        precision={2}
                        disabled={true}
                    />
                </div>
                </>
                }
                <div className="mb-3 col-6">
                    <label htmlFor="fechaProceso" className="form-label">Fecha Programada</label>
                    <DatePickerCustom
                        name="fechaProceso"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaProceso }
                        onChange={ formHandle }
                        time={true}
                        disabled={props.disabled || (state.entity.id > 0)}
                    />
                </div>
                {(state.entity.id > 0) &&
                <>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="fechaInicio" className="form-label">Fecha inicio</label>
                    <DatePickerCustom
                        name="fechaInicio"
                        placeholder=""
                        className="form-control"
                        value={ state.entity.fechaInicio }
                        time={true}
                        disabled={true}
                    />
                </div>                
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="fechaFin" className="form-label">Fecha fin</label>
                    <DatePickerCustom
                        name="fechaFin"
                        placeholder=""
                        className="form-control"
                        value={ state.entity.fechaFin }
                        time={true}
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-12">
                    <label htmlFor="observacion" className="form-label">Observación</label>
                    <input
                        name="observacion"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ state.entity.observacion }
                        disabled={true}
                    />
                </div>
                </>
                }
            </div>
          </div>
          <div className="modal-footer">
            {!props.disabled && (state.entity.id === 0) &&
              <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() } >Ingresar Proceso</button>
            }
            {!props.disabled && (state.entity.idEstadoProceso === PROCESO_STATE.PENDIENTE || state.entity.idEstadoProceso === PROCESO_STATE.PROGRESO) &&
              <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickCancel() } >Cancelar Proceso</button>
            }
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Salir</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

ProcesoModal.propTypes = {
  disabled: bool,
  proceso: object.isRequired,
  onDismiss: func.isRequired,
  onConfirm: func,
  onCancel: func
};

ProcesoModal.defaultProps = {
  disabled: false,
  onConfirm: null,
  onCancel: null
};

export default ProcesoModal;