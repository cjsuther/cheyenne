import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject, GetFieldMes } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import ValuacionModal from '../ValuacionModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';
import { getFormatNumber } from '../../../utils/convert';


const ValuacionesGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idInmueble: 0,
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
        idInmueble: props.data.idInmueble,
        list: list };
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowLista] = useLista({
    listas: ['TipoValuacion'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoValuacion',
      timeout: 0
    }
  });

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickValuacionAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickValuacionView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickValuacionModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickValuacionRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickValuacionesDataTagger(data.value) } className="link">
                                      <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>                                  
                              </div>

  const getDescTipoValuacion = (id) => {
    const row = getRowLista('TipoValuacion', id);
    return (row) ? row.nombre : '';
  }

  const tableColumns = [
    { Header: 'Tipo Valuación', Cell: (props) => getDescTipoValuacion(props.value), accessor: 'idTipoValuacion', width: '40%' },
    { Header: 'Ejercicio / Mes', Cell: (props) => {
        const row = props.row.original;
        const ejercicio = `${row.ejercicio} - ${GetFieldMes(row.mes, 'name')}`;
        return ejercicio;
      }, id: 'ejercicio', accessor: 'id', width: '30%' },
    { Header: 'Valor ($)', Cell: (props) => getFormatNumber(props.value,2), accessor: 'valor', width: '20%', alignCell: 'right' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickValuacionAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idInmueble: state.idInmueble,
        idTipoValuacion: 0,
        ejercicio: "",
        mes: 1,
        valor: 0,
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickValuacionView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickValuacionModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickValuacionRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleClickValuacionesDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }  

  //funciones
  function RemoveValuacion(row) {
    row.state = 'r';
    props.onChange('Valuacion', row);
  }

  function UpdateValuacion(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('Valuacion', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
          title="Información adicional de Valuación"
          processKey={props.processKey}
          entidad="Valuacion"
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
              RemoveValuacion(row);
            }}
        />
    }

    {state.showForm && 
        <ValuacionModal
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
              UpdateValuacion(row);
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

ValuacionesGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

ValuacionesGrid.defaultProps = {
  disabled: false
};

export default ValuacionesGrid;