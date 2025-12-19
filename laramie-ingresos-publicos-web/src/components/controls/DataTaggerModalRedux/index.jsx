import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { string, number, func, bool } from 'prop-types';
import { dataTaggerActionAdd, dataTaggerActionModify, dataTaggerActionRemove } from '../../../context/redux/actions/dataTaggerAction';
import { DataTagger } from '../../common';
import { DATA_TAGGER_TYPE } from '../../../consts/dataTaggerType';

import './index.css';


const DataTaggerModalRedux = (props) => {

  //hooks
  const [state, setState] = useState({
    processKey: "",
    entidad: "",
    idEntidad: 0
  });

  const [controllerDataTagger, setControllerDataTagger] = useState({
    entidad: "",
    idEntidad: 0,
    data: {
      archivos: [],
      observaciones: [],
      etiquetas: []
    },
    addRow: (dataTaggerType, row, success, error) => {},
    removeRow: (dataTaggerType, row, success, error) => {}
  });

  const dispatch = useDispatch();
  const dataTagger = useSelector( (state) => state.dataTagger.data );

  const mount = () => {
    setState(prevState => {
      return {...prevState,
        processKey: props.processKey,
        entidad: props.entidad,
        idEntidad: props.idEntidad
      };
    });
  }
  useEffect(mount, [props]);

  useEffect(() => {
      setControllerDataTagger({
          entidad: state.entidad,
          idEntidad: state.idEntidad,
          data: (dataTagger && dataTagger[state.processKey]) ? {
              archivos: dataTagger[state.processKey].Archivo.filter(f => f.entidad === state.entidad && f.idEntidad === state.idEntidad && f.state !== 'r'),
              observaciones: dataTagger[state.processKey].Observacion.filter(f => f.entidad === state.entidad && f.idEntidad === state.idEntidad && f.state !== 'r'),
              etiquetas: dataTagger[state.processKey].Etiqueta.filter(f => f.entidad === state.entidad && f.idEntidad === state.idEntidad && f.state !== 'r')
          } : {
              archivos: [],
              observaciones: [],
              etiquetas: []
          },
          addRow: (dataTaggerType, row, success, error) => {
              let list = null;
              switch(dataTaggerType) {
                  case DATA_TAGGER_TYPE.ARCHIVO:
                      list = dataTagger[state.processKey].Archivo;
                      break;
                  case DATA_TAGGER_TYPE.OBSERVACION:
                      list = dataTagger[state.processKey].Observacion;
                      break;
                  case DATA_TAGGER_TYPE.ETIQUETA:
                      list = dataTagger[state.processKey].Etiqueta;
                      break;
                  default:
                      break;
              }
              let idMin = Math.min(...list.map(x => x.id));
              row.id = (idMin >= 0) ? -1 : --idMin; //las altas tienen un id negativo
              row.state = 'a';

              dispatch(dataTaggerActionAdd(state.processKey,dataTaggerType,row));
              success();
          },
          removeRow: (dataTaggerType, row, success, error) => {
              if (row.id <= 0) {
                  dispatch(dataTaggerActionRemove(state.processKey,dataTaggerType,row));
              }
              else {
                  row.state = 'r';
                  dispatch(dataTaggerActionModify(state.processKey,dataTaggerType,row));
              }
              success();
          }
      });  
  }, [dataTagger, state.entidad, state.idEntidad, state.processKey]);


  return (
    <div className='data-tagger-modal'>

      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-lg">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">{props.title}</h5>
              <i className="modal-icon fa fa-info-circle"></i>
            </div>
            <div className="modal-body">

              <DataTagger
                controller={controllerDataTagger}
                disabled={props.disabled}
              />

            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Salir</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

DataTaggerModalRedux.propTypes = {
  disabled: bool,
  title: string.isRequired,
  processKey: string.isRequired,
  entidad: string.isRequired,
  idEntidad: number.isRequired,
  onDismiss: func.isRequired
};

DataTaggerModalRedux.defaultProps = {
  disabled: false
};

export default DataTaggerModalRedux;
