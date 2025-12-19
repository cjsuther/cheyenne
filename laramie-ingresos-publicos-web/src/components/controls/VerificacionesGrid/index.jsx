import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import VerificacionModal from '../VerificacionModal';
import ShowToastMessage from '../../../utils/toast';
import { getDateToString } from '../../../utils/convert';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';

const VerificacionesGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idInhumado: 0,
      disabled: false,
      showMessage: false,
      showForm: false,
      modeFormEdit: false,
      rowForm: null,
      dataTagger: {
        showModal: false,
        idEntidad: null
      },      
      list: []
  });

  const dispatch = useDispatch();
  const sequenceValue = useSelector( (state) => state.sequence.value );

  const mount = () => {
    setState(prevState => {
      const list = props.data.list.filter(x => x.state !== 'r');
      return {...prevState,
        idInhumado: props.data.idInhumado,
        list: list };
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowLista ] = useLista({
    listas: ['ResultadoVerificacion'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {

      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'ResultadoVerificacion',
      timeout: 0
    }
  });

  const getDescResultadoVerificacion = (id) => {
    const row = getRowLista('ResultadoVerificacion', id);
    return (row) ? row.nombre : '';
  }

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickVerificacionAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickVerificacionView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickVerificacionModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickVerificacionRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickVerificacionDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>                                  
                              </div>

  const tableColumns = [
    { Header: 'Fecha', Cell: (data) => getDateToString(data.value, false), accessor: 'fecha', width: '10%' },
    { Header: 'Verificador', Cell: (props) => {
        const row = props.row.original;
        return `${row.nombreVerificador} ${row.apellidoVerificador}`;
      }, accessor: 'verificador', width: '30%' },     
    { Header: 'Resultado', Cell: (props) => getDescResultadoVerificacion(props.value), accessor: 'idResultadoVerificacion', width: '15%' },
    { Header: 'Motivo', accessor: 'motivoVerificacion', width: '35%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];

  //handles
  const handleClickVerificacionAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idInhumado: state.idInhumado,
        fecha: null,
        motivoVerificacion: '',
        idTipoDocumentoVerificador: 0,
        numeroDocumentoVerificador: '',
        apellidoVerificador: '',
        nombreVerificador: '',
        idResultadoVerificacion: 0,      
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickVerificacionView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickVerificacionModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickVerificacionRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }
  const handleClickVerificacionDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }  

  //funciones
  function RemoveVerificacion(row) {
    row.state = 'r';
    props.onChange('Verificacion', row);
  }

  function UpdateVerificacion(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('Verificacion', row);
  }


  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
          title="Información adicional de Verificaciones"
          processKey={props.processKey}
          entidad="Verificacion"
          idEntidad={state.dataTagger.idEntidad}
          disabled={props.disabled}
          onDismiss={() => {
            setState(prevState => {
              return {...prevState, dataTagger: {showModal: false, idEntidad: null}};
            });
          }}
      />
    }

    {state.showMessage && 
        <MessageModal
            title={"Confirmación"}
            message={"¿Está seguro de borrar el registro?"}
            onDismiss={() => {
              setState(prevState => {
                  return {...prevState, showMessage: false, rowForm: null};
              });
            }}
            onConfirm={() => {
              const row = CloneObject(state.rowForm);
              setState(prevState => {
                  return {...prevState, showMessage: false, rowForm: null};
              });
              RemoveVerificacion(row);
            }}
        />
    }

    {state.showForm && 
        <VerificacionModal
            processKey={props.processKey}
            disabled={!state.modeFormEdit}
            data={{
              entity: state.rowForm
            }}
            onDismiss={() => {
              setState(prevState => {
                  return {...prevState, showForm: false, rowForm: null};
              });
            }}
            onConfirm={(row) => {
              setState(prevState => {
                  return {...prevState, showForm: false, rowForm: null};
              });
              UpdateVerificacion(row);
            }}
        />
    }

    <TableCustom
        showFilterGlobal={false}
        showPagination={false}
        className={'TableCustomBase'}
        columns={tableColumns}
        data={state.list}
    />
 

  </>
  );
}

VerificacionesGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

VerificacionesGrid.defaultProps = {
  disabled: false
};

export default VerificacionesGrid;