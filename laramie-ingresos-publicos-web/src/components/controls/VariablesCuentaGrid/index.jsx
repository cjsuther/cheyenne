import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import VariableCuentaModal from '../VariableCuentaModal';
import { CloneObject } from '../../../utils/helpers';
import { isNull } from '../../../utils/validator';
import { getDateToString, getFormatValueGrid, getFormatValueIn } from '../../../utils/convert';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import { useEntidad } from '../../hooks/useEntidad';

const VariablesCuentaGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idCuenta: 0,
      idVariable: 0,
      disabled: false,
      showMessage: false,
      showForm: false,
      modeFormEdit: false,
      rowForm: null,
      list: []
  });
  const [variable, setVariable] = useState({
    id: 0,
    codigo: '',
    descripcion: '',
    idTipoTributo: 0,
    tipoDato: '',
    constante: false,
    predefinido: false,
    opcional: true,
    activo: true
  });

  const dispatch = useDispatch();
  const sequenceValue = useSelector( (state) => state.sequence.value );

  const mount = () => {
    setState(prevState => {
        const list = props.data.list.filter(x => x.state !== 'r').sort((a, b) => (b.fechaDesde < a.fechaDesde) ? -1 : (b.fechaDesde < a.fechaDesde) ? 1 : 0);
        return {...prevState,
            idCuenta: props.data.idCuenta,
            idVariable: props.data.idVariable,
            list: list
        };
    });
  }
  useEffect(mount, [props.data]);

  const [, geRowEntidad, readyEntidad] = useEntidad({
    entidades: ['Variable'],
    onLoaded: (entidades, isSuccess, error) => {
      if (!isSuccess) {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'Variable',
      timeout: 0
    }
  });

  useEffect(() => {
    const row = geRowEntidad('Variable', state.idVariable);
    if (row) {
      setVariable(row);
    }
  }, [state.idVariable, readyEntidad]);


  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (!variable.constante || state.list.length === 0) && (
                                    <div onClick={ (event) => handleClickVariableCuentaAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickVariableCuentaView(data.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickVariableCuentaModify(data.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    )}
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickVariableCuentaRemove(data.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    )}
                              </div>

  const tableColumnsVariable = [
    { Header: 'Desde', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaDesde', width: '20%' },
    { Header: 'Hasta', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaHasta', width: '20%' }
  ];
  const tableColumnsValor = [
    { Header: 'Valor', Cell: (props) => getFormatValueGrid(props.value, variable.tipoDato, true), accessor: 'valor', width: '50%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];
  const tableColumns = (variable.constante) ? tableColumnsValor : tableColumnsVariable.concat(tableColumnsValor);

  //handles
  const handleClickVariableCuentaAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idVariable: state.idVariable,
        idCuenta: state.idCuenta,
        valor: '',
        fechaDesde: null,
        fechaHasta: null
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickVariableCuentaView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickVariableCuentaModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickVariableCuentaRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  //funciones
  function RemoveVariableCuenta(row) {
    row.state = 'r';
    props.onChange('VariableCuenta', row);
  }

  function UpdateVariableCuenta(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('VariableCuenta', row);
  }

  function ValidateVariableCuenta(row) {
    const listOthers = state.list.filter(f => f.id !== row.id);
    const conflicts = listOthers.filter(f =>
      (f.fechaDesde <= row.fechaHasta || isNull(f.fechaDesde) || isNull(row.fechaHasta)) &&
      (f.fechaHasta >= row.fechaDesde || isNull(f.fechaHasta) || isNull(row.fechaDesde))
    );
    return (conflicts.length === 0);
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
                RemoveVariableCuenta(row);
            }}
        />
    }

    {state.showForm && 
        <VariableCuentaModal
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
              if (ValidateVariableCuenta(row)) {
                setState(prevState => {
                    return {...prevState, showForm: false, rowForm: null};
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
        data={state.list}
    />

  </>
  );
}

VariablesCuentaGrid.propTypes = {
    disabled: bool,
    data: object.isRequired,
    onChange: func.isRequired
};

VariablesCuentaGrid.defaultProps = {
    disabled: false
  };

export default VariablesCuentaGrid;