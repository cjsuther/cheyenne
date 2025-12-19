import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import EmisionCalculoModal from '../EmisionCalculoModal';
import ShowToastMessage from '../../../utils/toast';
import { isNull } from '../../../utils/validator';


const EmisionCalculosGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idEmisionDefinicion: 0,
      disabled: false,
      showMessage: false,
      showForm: false,
      modeFormEdit: false,
      rowForm: null,    
      listCalculos: [],
      listVariables: [],
      listFunciones: [],
      listParametros: [],
      listElementos: []
  });

  const dispatch = useDispatch();
  const sequenceValue = useSelector( (state) => state.sequence.value );

  const mount = () => {
    setState(prevState => {
      const listCalculos = props.data.listCalculos.filter(x => x.state !== 'r').sort((a, b) => a.orden - b.orden);
      return {...prevState,
        idEmisionDefinicion: props.data.idEmisionDefinicion,
        listCalculos: listCalculos,
        listVariables: props.data.listVariables,
        listFunciones: props.data.listFunciones,
        listParametros: props.data.listParametros,
        listElementos: props.data.listElementos
      };
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowLista] = useLista({
    listas: ['TipoEmisionCalculo'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoEmisionCalculo',
      timeout: 0
    }
  });

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickEmisionCalculoAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickEmisionCalculoView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && !data.row.original.soloLectura && (
                                  <div onClick={ (event) => handleClickEmisionCalculoModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && !data.row.original.soloLectura && (
                                  <div onClick={ (event) => handleClickEmisionCalculoRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}                                 
                              </div>

  const getDescTipoEmisionCalculo = (id) => {
    const row = getRowLista('TipoEmisionCalculo', id);
    return (row) ? row.nombre : '';
  }

  const tableColumns = [
    { Header: 'Orden', accessor: 'orden', width: '5%', disableSortBy: true  },
    { Header: 'Tipo Cálculo', Cell: (props) => getDescTipoEmisionCalculo(props.value), accessor: 'idTipoEmisionCalculo', width: '10%', disableSortBy: true  },
    { Header: 'Código', accessor: 'codigo', width: '15%', disableSortBy: true  },
    { Header: 'Nombre', accessor: 'nombre', width: '20%', disableSortBy: true  },
    { Header: 'Descripción', accessor: 'descripcion', width: '40%', disableSortBy: true  },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickEmisionCalculoAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idEmisionDefinicion: state.idEmisionDefinicion,
        idTipoEmisionCalculo: 0,
        codigo: "",
        nombre: "",
        descripcion: "",
        guardaValor: false,
        formula: "",
        orden: 0,
        soloLectura: false,
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickEmisionCalculoView = (id) => {
    setState(prevState => {
      const rowForm = state.listCalculos.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickEmisionCalculoModify = (id) => {
    setState(prevState => {
      const rowForm = state.listCalculos.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickEmisionCalculoRemove = (id) => {
    setState(prevState => {
      const rowForm = state.listCalculos.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  } 

  //funciones
  function RemoveEmisionCalculo(row) {
    row.state = 'r';
    props.onChange('EmisionCalculo', row);
  }

  function UpdateEmisionCalculo(row) {
    row.state = isNull(state.listCalculos.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('EmisionCalculo', row);
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
              RemoveEmisionCalculo(row);
            }}
        />
    }

    {state.showForm && 
        <EmisionCalculoModal
            disabled={!state.modeFormEdit}
            showElementos={props.showElementos}
            showEntidades={props.showEntidades}
            data={{
              entity: state.rowForm,
              listCalculos: state.listCalculos,
              listVariables: state.listVariables,
              listFunciones: state.listFunciones,
              listParametros: state.listParametros,
              listElementos: state.listElementos
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
              UpdateEmisionCalculo(row);
            }}
            onMovePrevious={(state.listCalculos.find(f => f.orden < state.rowForm.orden)) ? () => {
              //tomo el primero de los menores ordenados de mayor a menor
              const idRowPrevious= state.listCalculos.filter(f => f.orden < state.rowForm.orden).sort((a, b) => b.orden - a.orden)[0].id;
              if (state.modeFormEdit)
                handleClickEmisionCalculoModify(idRowPrevious);
              else
                handleClickEmisionCalculoView(idRowPrevious);
            } : null}
            onMoveNext={(state.listCalculos.find(f => f.orden > state.rowForm.orden)) ? () => {
              //tomo el primero de los mayores ordenados de menor a mayor
              const idRowNext = state.listCalculos.filter(f => f.orden > state.rowForm.orden).sort((a, b) => a.orden - b.orden)[0].id;
              if (state.modeFormEdit)
                handleClickEmisionCalculoModify(idRowNext);
              else
                handleClickEmisionCalculoView(idRowNext);
            } : null}
        />
    }

    <TableCustom
        showFilterGlobal={false}
        showPagination={false}
        className={'TableCustomBase'}
        columns={tableColumns}
        data={state.listCalculos}
    />

  </>
  );
}

EmisionCalculosGrid.propTypes = {
  disabled: bool,
  showEntidades: bool,
  showElementos: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

EmisionCalculosGrid.defaultProps = {
  disabled: false,
  showEntidades: false,
  showElementos: false
};

export default EmisionCalculosGrid;