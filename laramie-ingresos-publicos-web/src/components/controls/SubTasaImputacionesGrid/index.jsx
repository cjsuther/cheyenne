import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import SubTasaImputacionModal from '../SubTasaImputacionModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';


const SubTasaImputacionesGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idTasa: 0,
      idSubTasa: 0,
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
        idTasa: props.data.idTasa,
        idSubTasa: props.data.idSubTasa,
        list: list };
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowEntidad,] = useEntidad({
    entidades: ['Jurisdiccion', 'RecursoPorRubro'],
    onLoaded: (entidades, isSuccess, error) => {
      if (!isSuccess) {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'Jurisdiccion_RecursoPorRubro',
      timeout: 0
    }
  });


  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickSubTasaImputacionAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickSubTasaImputacionView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickSubTasaImputacionModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickSubTasaImputacionRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickSubTasaImputacionesDataTagger(data.value) } className="link">
                                      <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>                                  
                              </div>

  const getDescJurisdiccionActual = (id) => {
    const row = getRowEntidad('Jurisdiccion', id);
    return (row) ? row.nombre : '';
  }
  const getDescRecursoPorRubroActual = (id) => {
    const row = getRowEntidad('RecursoPorRubro', id);
    return (row) ? row.nombre : '';
  }

  const tableColumns = [
    { Header: 'Ejercicio', id:'ejercicio', accessor: 'ejercicio', width: '10%' },
    { Header: 'Jurisdiccion actual', Cell: (props) => getDescJurisdiccionActual(props.value), accessor: 'idJurisdiccionActual', width: '40%' },
    { Header: 'Recurso por rubro actual', Cell: (props) => getDescRecursoPorRubroActual(props.value), accessor: 'idRecursoPorRubroActual', width: '40%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '8%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickSubTasaImputacionAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idTasa: state.idTasa,
        idSubTasa: state.idSubTasa,
        ejercicio: "",
        idTipoCuota: 0,
        idCuentaContable: 0,
        idCuentaContableAnterior: 0,
        idCuentaContableFutura: 0,
        idJurisdiccionActual: 0,
        idRecursoPorRubroActual: 0,
        idJurisdiccionAnterior: 0,
        idRecursoPorRubroAnterior: 0,
        idJurisdiccionFutura: 0,
        idRecursoPorRubroFutura: 0,
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickSubTasaImputacionView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickSubTasaImputacionModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickSubTasaImputacionRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleClickSubTasaImputacionesDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }  

  //funciones
  function RemoveSubTasaImputacion(row) {
    row.state = 'r';
    props.onChange('SubTasaImputacion', row);
  }

  function UpdateSubTasaImputacion(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('SubTasaImputacion', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
          title="Información adicional de imputaciones"
          processKey={props.processKey}
          entidad="SubTasaImputacion"
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
              RemoveSubTasaImputacion(row);
            }}
        />
    }

    {state.showForm && 
        <SubTasaImputacionModal
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
              UpdateSubTasaImputacion(row);
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

SubTasaImputacionesGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

SubTasaImputacionesGrid.defaultProps = {
  disabled: false
};

export default SubTasaImputacionesGrid;