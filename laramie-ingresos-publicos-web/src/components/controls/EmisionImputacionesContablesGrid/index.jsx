import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import { useEntidad } from '../../hooks/useEntidad';
import EmisionImputacionContableModal from '../EmisionImputacionContableModal';
import ShowToastMessage from '../../../utils/toast';
import { isNull } from '../../../utils/validator';


const EmisionImputacionesContablesGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idEmisionDefinicion: 0,
      disabled: false,
      showMessage: false,
      showForm: false,
      modeFormEdit: false,
      rowForm: null,
      listImputacionesContables: [],
      listCalculos: [],
      listFunciones: []
  });

  const dispatch = useDispatch();
  const sequenceValue = useSelector( (state) => state.sequence.value );

  const mount = () => {
    setState(prevState => {
      const listImputacionesContables = props.data.listImputacionesContables.filter(x => x.state !== 'r').sort((a, b) => a.orden - b.orden);
      return {...prevState,
        idEmisionDefinicion: props.data.idEmisionDefinicion,
        listImputacionesContables: listImputacionesContables,
        listCalculos: props.data.listCalculos,
        listFunciones: props.data.listFunciones
      };
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowEntidad] = useEntidad({
    entidades: ['Tasa', 'SubTasa','TipoMovimiento'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'Tasa_SubTasa_TipoMovimiento',
      timeout: 0
    }
  });

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickEmisionImputacionContableAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickEmisionImputacionContableView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && !data.row.original.soloLectura && (
                                  <div onClick={ (event) => handleClickEmisionImputacionContableModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && !data.row.original.soloLectura && (
                                  <div onClick={ (event) => handleClickEmisionImputacionContableRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}                                 
                              </div>

  const getDescTipoMovimiento = (id) => {
    const row = getRowEntidad('TipoMovimiento', id);
    return (row) ? row.nombre : '';
  }
  const getDescSubTasa = (id) => {
    const row = getRowEntidad('SubTasa', id);
    return (row) ? `${row.codigo} - ${row.descripcion}` : '';
  }
  const getCodigoTasa = (id) => {
    const row = getRowEntidad('Tasa', id);
    return (row) ? row.codigo : '';
  }
  const getCodigoSubTasa = (id) => {
    const row = getRowEntidad('SubTasa', id);
    return (row) ? row.codigo : '';
  }


  const tableColumns = [
    { Header: 'Orden', accessor: 'orden', width: '5%', disableSortBy: true  },
    { Header: 'Descripción', accessor: 'descripcion', width: '20%', disableSortBy: true },
    { Header: 'Movimiento', Cell: (props) => getDescTipoMovimiento(props.value), accessor: 'idTipoMovimiento', width: '15%', disableSortBy: true },
    { Header: 'Tasa', Cell: (props) => getCodigoTasa(props.value), accessor: 'idTasa', width: '10%', disableSortBy: true },
    { Header: 'SubTasa', Cell: (props) => getDescSubTasa(props.value), accessor: 'idSubTasa', width: '15%', disableSortBy: true },
    { Header: 'Tasa %', Cell: (props) => getCodigoTasa(props.value), accessor: 'idTasaPorcentaje', width: '10%', disableSortBy: true },
    { Header: 'SubTasa %', Cell: (props) => getDescSubTasa(props.value), accessor: 'idSubTasaPorcentaje', width: '10%', disableSortBy: true },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickEmisionImputacionContableAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idEmisionDefinicion: state.idEmisionDefinicion,
        idTasa: 0,
        idSubTasa: 0,
        idTipoMovimiento: 0,
        descripcion: "",
        formulaCondicion: "",
        formulaPorcentaje: "",
        idTasaPorcentaje: 0,
        idSubTasaPorcentaje: 0,
        orden: 0,
        soloLectura: 0,
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickEmisionImputacionContableView = (id) => {
    setState(prevState => {
      const rowForm = state.listImputacionesContables.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickEmisionImputacionContableModify = (id) => {
    setState(prevState => {
      const rowForm = state.listImputacionesContables.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickEmisionImputacionContableRemove = (id) => {
    setState(prevState => {
      const rowForm = state.listImputacionesContables.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  } 

  //funciones
  function RemoveEmisionImputacionContable(row) {
    row.state = 'r';
    props.onChange('EmisionImputacionContable', row);
  }

  function UpdateEmisionImputacionContable(row) {
    row.state = isNull(state.listImputacionesContables.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('EmisionImputacionContable', row);
  }

  return (
  <>

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
              RemoveEmisionImputacionContable(row);
            }}
        />
    }

    {state.showForm && 
        <EmisionImputacionContableModal
            disabled={!state.modeFormEdit}
            data={{
              entity: state.rowForm,
              listCalculos: state.listCalculos,
              listFunciones: state.listFunciones
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
              UpdateEmisionImputacionContable(row);
            }}
            onMovePrevious={(state.listImputacionesContables.find(f => f.orden < state.rowForm.orden)) ? () => {
              //tomo el primero de los menores ordenados de mayor a menor
              const idRowPrevious= state.listImputacionesContables.filter(f => f.orden < state.rowForm.orden).sort((a, b) => b.orden - a.orden)[0].id;
              if (state.modeFormEdit)
                handleClickEmisionImputacionContableModify(idRowPrevious);
              else
                handleClickEmisionImputacionContableView(idRowPrevious);
            } : null}
            onMoveNext={(state.listImputacionesContables.find(f => f.orden > state.rowForm.orden)) ? () => {
              //tomo el primero de los mayores ordenados de menor a mayor
              const idRowNext = state.listImputacionesContables.filter(f => f.orden > state.rowForm.orden).sort((a, b) => a.orden - b.orden)[0].id;
              if (state.modeFormEdit)
                handleClickEmisionImputacionContableModify(idRowNext);
              else
                handleClickEmisionImputacionContableView(idRowNext);
            } : null}
        />
    }

    <TableCustom
        showFilterGlobal={false}
        showPagination={false}
        className={'TableCustomBase'}
        columns={tableColumns}
        data={state.listImputacionesContables}
    />

  </>
  );
}

EmisionImputacionesContablesGrid.propTypes = {
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

EmisionImputacionesContablesGrid.defaultProps = {
  disabled: false
};

export default EmisionImputacionesContablesGrid;