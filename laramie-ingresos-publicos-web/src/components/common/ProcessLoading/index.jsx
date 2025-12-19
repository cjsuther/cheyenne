import React, { useState, useEffect } from 'react';
import { object, string, bool, func } from 'prop-types';
import { PROCESO_STATE } from '../../../consts/procesoState';



const ProcessLoading = (props) => {

  const procesoInit = {
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
  }

  const [state, setState] = useState({
    proceso: procesoInit
  });

  useEffect(() => {
    if (props.proceso.identificador !== state.proceso.identificador || props.proceso.idEstadoProceso !== state.proceso.idEstadoProceso) {

      if (props.proceso.idEstadoProceso === PROCESO_STATE.FINALIZADO && 
          state.proceso.idEstadoProceso !== PROCESO_STATE.FINALIZADO &&
          state.proceso.idEstadoProceso !== 0) {
        if (props.onFinish) {
          props.onFinish();
        }
      }

      setState(prevState => {
        return {...prevState, proceso: props.proceso};
      });

    }
  }, [props.proceso]);

  const handleClick = () => {
    if (props.onClick) {
      props.onClick(state.proceso);
    }
  }

  return (

    <>
    
      <div className={props.className}>
        {(state.proceso.idEstadoProceso !== PROCESO_STATE.FINALIZADO || props.showFinalizado) &&
        <div onClick={ (event) => handleClick() } className="link">
          <p className="text-left" title={state.proceso.observacion}>
              {
                (state.proceso.idEstadoProceso === PROCESO_STATE.PENDIENTE) ? <i className="fa fa-clock m-right-10"></i> :
                (state.proceso.idEstadoProceso === PROCESO_STATE.PROGRESO) ? <i className="fa fa-spinner fa-spin m-right-10"></i> :
                (state.proceso.idEstadoProceso === PROCESO_STATE.ERROR) ? <i className="fa fa-times m-right-10"></i> :
                (state.proceso.idEstadoProceso === PROCESO_STATE.FINALIZADO) ? <i className="fa fa-check m-right-10"></i> :
                (state.proceso.idEstadoProceso === PROCESO_STATE.CANCELADO) ? <i className="fa fa-times m-right-10"></i> : ""
              }
          </p>
        </div>
        }
      </div>

    </>

  );
}

ProcessLoading.propTypes = {
    className: string,
    proceso: object.isRequired,
    showFinalizado: bool,
    onFinish: func,
    onClick: func
};

ProcessLoading.defaultProps = {
    className: '',
    showFinalizado: false,
    onFinish: null,
    onClick: null
};

export default ProcessLoading;
