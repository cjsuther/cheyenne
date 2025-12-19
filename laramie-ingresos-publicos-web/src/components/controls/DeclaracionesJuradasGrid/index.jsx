import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject, GetMeses } from '../../../utils/helpers';
import DeclaracionJuradaModal from '../DeclaracionJuradaModal';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { getDateToString, getFormatNumber } from '../../../utils/convert';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import { useEntidad } from '../../hooks/useEntidad';
import { isNull, isValidNumber } from '../../../utils/validator';

const DeclaracionesJuradasGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idCuenta: 0,
      idTipoTributo: 0,
      idTributo: 0,
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

  const [listTableState, setListTableState] = useState();

  const dispatch = useDispatch();
  const sequenceValue = useSelector( (state) => state.sequence.value );

  const mount = () => {
    const list = props.data.list.filter(x => x.state !== 'r');
    setState(prevState => {
      return {...prevState,
        idCuenta: props.data.idCuenta,
        idTributo: props.data.idTributo,
        idTipoTributo: props.data.idTipoTributo,
        list: list };
    });

    const meses = GetMeses(false)
    const tableList = [...list];
    tableList.forEach(value => {
      let mes = meses.filter(m => m.key == value.mesDeclaracion)[0];
      value.anioMesDeclaracion = value.anioDeclaracion + "-" + mes.code;
    })

    setListTableState(tableList);

  }
  useEffect(mount, [props.data]);

  const [, getRowEntidad] = useEntidad({
    entidades: ['Tasa', 'SubTasa', 'Rubro'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'Tasa_SubTasa_Rubro',
      timeout: 0
    }
  });

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickDeclaracionesJuradasAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickDeclaracionesJuradasView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickDeclaracionesJuradasModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickDeclaracionesJuradasRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickDeclaracionesJuradasDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>                                  
                              </div>

  const getDescTasa = (id) => {
    const row = getRowEntidad('Tasa', id);
    return (row) ? row.codigo + " - " + row.descripcion : '';
  } 

  const getDescSubTasa = (id) => {
      const row = getRowEntidad('SubTasa', id);
      return (row) ? row.codigo + " - " + row.descripcion : '';
  }

  const tableColumns = [
    { Header: 'Fecha de presentación', Cell: (data) => getDateToString(data.value, false), accessor: 'fechaPresentacionDDJJ', width: '22%' },
    { Header: 'Año-Mes', accessor: 'anioMesDeclaracion', width: '15%' },
    { Header: 'Tasa', Cell: (props) => getDescTasa(props.value), accessor: 'idTasa', width: '22%' },
    { Header: 'Sub Tasa', Cell: (props) => getDescSubTasa(props.value), accessor: 'idSubTasa', width: '22%' },
    { Header: 'Valor', Cell: (data) => isValidNumber(data.value) ? getFormatNumber(data.value, 2) : data.value, accessor: 'valorDeclaracion', alignCell: 'right', width: '10%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '9%', disableGlobalFilter: true, disableSortBy: true }
  ];

  //handles
  const handleClickDeclaracionesJuradasAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idCuenta: state.idCuenta,
        idTipoTributo: state.idTipoTributo,
        idTributo: state.idTributo,
        idTasa: 0,
        idSubTasa: 0,
        fechaPresentacionDDJJ: null,
        anioDeclaracion: '',
        mesDeclaracion: 0,
        numero: '',
        idTipoDDJJ: 0,
        valorDeclaracion: 0,
        fechaAlta: null,
        fechaBaja: null,
        resolucion: '',
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickDeclaracionesJuradasView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickDeclaracionesJuradasModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickDeclaracionesJuradasRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }
  const handleClickDeclaracionesJuradasDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }  

  //funciones
  function RemoveDeclaracionJurada(row) {
    row.state = 'r';
    props.onChange('DeclaracionJurada', row);
  }

  function UpdateDeclaracionJurada(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('DeclaracionJurada', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
          title="Información adicional de Declaraciones Juradas"
          processKey={props.processKey}
          entidad="DeclaracionJurada"
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
              RemoveDeclaracionJurada(row);
            }}
        />
    }

    {state.showForm && 
        <DeclaracionJuradaModal
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
              UpdateDeclaracionJurada(row);
            }}
        />
    }

    <TableCustom
        showFilterGlobal={false}
        showPagination={false}
        className={'TableCustomBase'}
        columns={tableColumns}
        data={listTableState}
    />
 

  </>
  );
}

DeclaracionesJuradasGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

DeclaracionesJuradasGrid.defaultProps = {
  disabled: false
};

export default DeclaracionesJuradasGrid;