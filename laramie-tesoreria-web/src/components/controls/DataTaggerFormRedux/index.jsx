import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { string, number, func, bool } from 'prop-types';
import { dataTaggerActionAdd, dataTaggerActionModify, dataTaggerActionRemove } from '../../../context/redux/actions/dataTaggerAction';
import { DataTagger } from '../../common';
import { DATA_TAGGER_TYPE } from '../../../consts/dataTaggerType';


const DataTaggerFormRedux = (props) => {

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
  useEffect(mount, [state.entidad, state.idEntidad, state.processKey]);

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
              if (props.onChange) {
                props.onChange(row);
              }
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
              if (props.onChange) {
                props.onChange(row);
              }
          }
      });  
  }, [dataTagger, state.entidad, state.idEntidad, state.processKey]);


  return (

      <DataTagger
        controller={controllerDataTagger}
        disabled={props.disabled}
      />
      
  );
}

DataTaggerFormRedux.propTypes = {
  disabled: bool,
  title: string.isRequired,
  processKey: string.isRequired,
  entidad: string.isRequired,
  idEntidad: number.isRequired,
  onChange: func
};

DataTaggerFormRedux.defaultProps = {
  disabled: false,
  onChange: null
};

export default DataTaggerFormRedux;
