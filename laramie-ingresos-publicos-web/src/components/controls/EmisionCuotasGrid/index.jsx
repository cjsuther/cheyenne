import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject, GetFieldMes } from '../../../utils/helpers';
import EmisionCuotaModal from '../EmisionCuotaModal';
import { getDateToString } from '../../../utils/convert';
import { isNull } from '../../../utils/validator';


const EmisionCuotasGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idEmisionEjecucion: 0,
      disabled: false,
      showMessage: false,
      showForm: false,
      modeFormEdit: false,
      rowForm: null,
      listCuotas: [],
      listVariables: [],
      listFunciones: [],
      fechaVencimiento1: null,
      fechaVencimiento2: null
  });

  const dispatch = useDispatch();
  const sequenceValue = useSelector( (state) => state.sequence.value );

  const mount = () => {
    const listCuotas = props.data.listCuotas.filter(x => x.state !== 'r');
    setState(prevState => {
      return {...prevState,
        idEmisionEjecucion: props.data.idEmisionEjecucion,
        listCuotas: listCuotas,
        listVariables: props.data.listVariables,
        listFunciones: props.data.listFunciones,
        fechaVencimiento1: props.data.fechaVencimiento1,
        fechaVencimiento2: props.data.fechaVencimiento2
      };
    });
  }
  useEffect(mount, [props.data]);

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickEmisionCuotaAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickEmisionCuotaView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickEmisionCuotaModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickEmisionCuotaRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}                                 
                              </div>

  const tableColumns = [
    { Header: 'Mes', Cell: (props) => {
      const row = props.row.original;
      return GetFieldMes(row.mes, 'name');
    }, id: 'mes', accessor: 'id', width: '12%' },
    { Header: 'Cuota', accessor: 'cuota', width: '12%', disableSortBy: true },
    { Header: '1° Vencimiento', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaVencimiento1', width: '18%' },
    { Header: '2° Vencimiento', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaVencimiento2', width: '18%' },
    { Header: 'Descripción', accessor: 'descripcion', width: '30%', disableSortBy: true  },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickEmisionCuotaAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idEmisionEjecucion: state.idEmisionEjecucion,
        cuota: "",
        mes: 0,
        descripcion: "",
        formulaCondicion: "",
        anioDDJJ: "",
        mesDDJJ: 0,
        fechaVencimiento1: state.fechaVencimiento1,
        fechaVencimiento2: state.fechaVencimiento2,
        orden: 0,
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickEmisionCuotaView = (id) => {
    setState(prevState => {
      const rowForm = state.listCuotas.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickEmisionCuotaModify = (id) => {
    setState(prevState => {
      const rowForm = state.listCuotas.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickEmisionCuotaRemove = (id) => {
    if (props.requireConfirmRemove) {
      setState(prevState => {
        const rowForm = state.listCuotas.find(x => x.id === id);
        return {...prevState, showMessage: true, rowForm: rowForm};
      });
    }
    else {
      const rowForm = state.listCuotas.find(x => x.id === id);
      const row = CloneObject(rowForm);
      RemoveEmisionCuota(row);
    }
  } 

  //funciones
  function RemoveEmisionCuota(row) {
    row.state = 'r';
    props.onChange('EmisionCuota', row);
  }

  function UpdateEmisionCuota(row) {
    row.state = isNull(state.listCuotas.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('EmisionCuota', row);
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
              RemoveEmisionCuota(row);
            }}
        />
    }

    {state.showForm && 
        <EmisionCuotaModal
            disabled={!state.modeFormEdit}
            disabledDates={(state.fechaVencimiento1 && state.fechaVencimiento2)}
            data={{
              entity: state.rowForm,
              listVariables: state.listVariables,
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
              UpdateEmisionCuota(row);
            }}
        />
    }

    <TableCustom
        showFilterGlobal={false}
        showPagination={false}
        className={'TableCustomBase'}
        columns={tableColumns}
        data={state.listCuotas}
    />

  </>
  );
}

EmisionCuotasGrid.propTypes = {
  disabled: bool,
  requireConfirmRemove: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

EmisionCuotasGrid.defaultProps = {
  disabled: false,
  requireConfirmRemove: true
};

export default EmisionCuotasGrid;