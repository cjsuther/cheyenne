import React, { useState, useEffect, useMemo } from 'react';
import { object, func, bool } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom } from '../../common';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import { useLista } from '../../hooks/useLista';
import VariableCuentaModal from '../VariableCuentaModal';
import VariableModal from '../VariableModal';
import VariablesCuentaGrid from '../VariablesCuentaGrid';
import EntidadesModal from '../EntidadesModal';
import ShowToastMessage from '../../../utils/toast';
import { getDateNow, getFormatValueGrid } from '../../../utils/convert';
import { isNull } from '../../../utils/validator';


const VariablesGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idTipoTributo: 0,
      idCuenta: 0,
      disabled: false,
      showVariables: false,
      showMessage: false,
      showFormVariableModal: false,
      showFormVariableCuentaModal: false,
      rowIdVariable: null,
      rowFormVariableCuenta: null,
      listVariable: [],
      listVariableCuenta: []
  });

  const dispatch = useDispatch();
  const sequenceValue = useSelector( (state) => state.sequence.value );

  const mount = () => {
    setState(prevState => {
      const listVariableCuenta = props.data.listVariableCuenta.filter(x => x.state !== 'r');
      return {...prevState,
        idTipoTributo: props.data.idTipoTributo,
        idCuenta: props.data.idCuenta,
        listVariableCuenta: listVariableCuenta };
    });
  }
  useEffect(mount, [props.data]);

  let listVariableVisible = useMemo(() => {
    const listVariableId = state.listVariableCuenta.map(x => x.idVariable);
    return state.listVariable.filter(f => (f.idTipoTributo === state.idTipoTributo || isNull(f.idTipoTributo)) && (f.predefinido || listVariableId.includes(f.id)));
  }, [state.listVariableCuenta]);


  const [getListEntidad, ] = useEntidad({
    entidades: ['Variable'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        const list = getListEntidad('Variable').filter(x => !x.global);
        setState(prevState => ({...prevState, listVariable: list}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'Variable',
      timeout: 0
    }
  });

  const [, getRowLista ] = useLista({
    listas: ['TipoTributo'],
    onLoaded: (listas, isSuccess, error) => {
      if (!isSuccess) {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoTributo',
      timeout: 0
    }
  });

  const getDescTipoTributo = (id) => {
      const row = getRowLista('TipoTributo', id);
      return (row) ? row.nombre : 'Todos los tributos';
  }

  const getVariableValor = (id) => {
    const today = getDateNow();
    let currentValue = '';
    if (state.listVariableCuenta.length > 0) {
      const listVariableCuentaXVariable = state.listVariableCuenta.filter(f => f.idVariable === id);
      const currentRow = listVariableCuentaXVariable.find(x =>
        (x.fechaDesde <= today || isNull(x.fechaDesde)) &&
        (x.fechaHasta >= today || isNull(x.fechaHasta))
      );
      if (!isNull(currentRow)) {
        const variable = state.listVariable.find(f => f.id === id);
        if (variable) {
          currentValue = getFormatValueGrid(currentRow.valor, variable.tipoDato, true);
        }
      }
    }
    return currentValue;
  }

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                    <div onClick={ (event) => handleClickVariableAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                              </div>
  const cellV = (data)  =>    <div className='action'>
                                  <div onClick={ (event) => handleClickVariableView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>                  
                              </div>
  const cellE = ({row}) =>    <div className='action' {...row.getToggleRowExpandedProps({title: "ver historial de cambios"})}>
                                <div className="link">
                                  {row.isExpanded ? 
                                    <i className="fa fa-angle-down icon-expanded"></i> :
                                    <i className="fa fa-angle-right"></i>
                                  }
                                </div>
                              </div>

  const tableColumns = [
    { Header: '', Cell: cellE, id:'expnader', width: '2%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Tipo Tributo', Cell: (props) => {
      const row = props.row.original;
      const tipoTributo = getDescTipoTributo(row.idTipoTributo);
      return tipoTributo;
    }, id: 'tipoTributo', accessor: 'id', width: '15%' },
    { Header: 'Código', accessor: 'codigo', width: '15%' },
    { Header: 'Descripción', accessor: 'descripcion', width: '30%' },
    { Header: 'Valor actual', Cell: (props) => {
      const row = props.row.original;
      const valorActual = getVariableValor(row.id);
      return valorActual;
    }, id: 'valorActual', accessor: 'id', width: '20%' },
    { Header: 'Activo', Cell: (props) => {
      const row = props.row.original;
      return (row.activo) ? 'Sí' : 'No';
    }, id: 'activo', accessor: 'id', width: '10%' },
    { Header: cellA, Cell: cellV, id:'abm', accessor: 'id', width: '8%', disableGlobalFilter: true, disableSortBy: true }
  ];

  const subComponent = ({row}) => (

    <div className='form-sub-component'>
      <div className='row'>
        <div className="col-12 col-lg-8 p-top-10">
          <label className="form-label">Historial de cambios</label>
          <VariablesCuentaGrid
              disabled={props.disabled || !row.original.activo}
              data={{
                idCuenta: state.idCuenta,
                idVariable: row.original.id,
                list: state.listVariableCuenta.filter(f => f.idVariable === row.original.id)
              }}
              onChange={(typeEntity, row) => {
                props.onChange(typeEntity, row);
              }}
          />
        </div>
      </div>
    </div>

  );

  //handles
  const handleClickVariableAdd = () => {
    setState(prevState => {
        return {...prevState, showVariables: true};
    });
  }
  const handleClickVariableView = (id) => {
    setState(prevState => {
        return {...prevState, showFormVariableModal: true, rowIdVariable: parseInt(id)};
    });
  }
  const handleClickVariableCuentaAdd = (idVariable) => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowFormVariableCuenta = {
        id: idTemporal,
        idVariable: idVariable,
        idCuenta: state.idCuenta,
        valor: '',
        fechaDesde: null,
        fechaHasta: null
      };
      return {...prevState, showVariables: false, showFormVariableCuentaModal: true, rowFormVariableCuenta: rowFormVariableCuenta};
    });
    dispatch( sequenceActionNext() );
  }

  //funciones
  function UpdateVariableCuenta(row) {
    row.state = isNull(state.listVariableCuenta.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('VariableCuenta', row);
  }

  function ValidateVariableCuenta(row) {
    const listOthers = state.listVariableCuenta.filter(f => f.idVariable === row.idVariable && f.id !== row.id);
    const conflicts = listOthers.filter(f =>
      (f.fechaDesde <= row.fechaHasta || isNull(f.fechaDesde) || isNull(row.fechaHasta)) &&
      (f.fechaHasta >= row.fechaDesde || isNull(f.fechaHasta) || isNull(row.fechaDesde))
    );
    return (conflicts.length === 0);
  }

  return (
  <>

    {state.showVariables && (
        <EntidadesModal
            title="Seleccione el tipo de variable a cargar"
            entidad="Variable"
            onDismiss={() => {
                setState(prevState => {
                    return {...prevState, showVariables: false};
                });
            }}
            onConfirm={(id, row) => {
                handleClickVariableCuentaAdd(id);
            }}
            filter={(row) => { return row.activo && !row.global && (isNull(row.idTipoTributo) || row.idTipoTributo === state.idTipoTributo) }}
            columns={[
                { Header: 'Tipo Tributo', Cell: (props) => {
                  const row = props.row.original;
                  const tipoTributo = getDescTipoTributo(row.idTipoTributo);
                  return tipoTributo;
                }, id: 'tipoTributo', accessor: 'id', width: '25%' },
                { Header: 'Código', accessor: 'codigo', width: '25%' },
                { Header: 'Descripción', accessor: 'descripcion', width: '50%' }
            ]}
            showWithoutSelection={false}
        />
    )}

    {state.showFormVariableModal && 
        <VariableModal
            id={state.rowIdVariable}
            disabled={true}
            onDismiss={() => {
              setState(prevState => {
                  return {...prevState, showFormVariableModal: false};
              });
            }}
            onConfirm={(id) => { }}
        />
    }

    {state.showFormVariableCuentaModal && 
        <VariableCuentaModal
            disabled={false}
            data={{
              entity: state.rowFormVariableCuenta
            }}
            onDismiss={() => {
              setState(prevState => {
                  return {...prevState, showFormVariableCuentaModal: false, rowFormVariableCuenta: null};
              });
            }}
            onConfirm={(row) => {
              if (ValidateVariableCuenta(row)) {
                setState(prevState => {
                  return {...prevState, showFormVariableCuentaModal: false, rowFormVariableCuenta: null};
                });
                UpdateVariableCuenta(row);
              }
              else {
                ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Los rangos de fechas se superponen con otros");
              }
            }}
        />
    }

    <TableCustom
        showFilterGlobal={false}
        showPagination={false}
        className={'TableCustomBase'}
        columns={tableColumns}
        data={listVariableVisible}
        subComponent={subComponent}
    />

  </>
  );
}

VariablesGrid.propTypes = {
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

VariablesGrid.defaultProps = {
  disabled: false
};

export default VariablesGrid;