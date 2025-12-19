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
          <div className="text-left" title={state.proceso.observacion}>
              {
                (state.proceso.idEstadoProceso === PROCESO_STATE.PENDIENTE) ? <span className="material-symbols-outlined m-right-10">schedule</span> :
                (state.proceso.idEstadoProceso === PROCESO_STATE.PROGRESO) ? <span className="material-symbols-outlined m-right-10">clock_loader_60</span> :
                (state.proceso.idEstadoProceso === PROCESO_STATE.ERROR) ? <span className="material-symbols-outlined m-right-10">error</span> :
                (state.proceso.idEstadoProceso === PROCESO_STATE.FINALIZADO) ? <span className="material-symbols-outlined m-right-10">check</span> :
                (state.proceso.idEstadoProceso === PROCESO_STATE.CANCELADO) ? <span className="material-symbols-outlined m-right-10">cancel</span> : ""
              }
          </div>
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
