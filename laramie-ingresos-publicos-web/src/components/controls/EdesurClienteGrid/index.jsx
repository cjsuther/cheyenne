import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import EdesurClienteModal from '../EdesurClienteModal';
import { isNull } from '../../../utils/validator';
import { getDateToString } from '../../../utils/convert';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { useLista } from '../../hooks/useLista';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';

const EdesurClienteGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idEdesur: 0,
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
        idEdesur: props.data.idEdesur,
        list: list };
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowLista ] = useLista({
    listas: ['TipoDocumento'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {

      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoDocumento',
      timeout: 0
    }
  });

  const getDescTipoDocumento = (id) => {
    const row = getRowLista('TipoDocumento', id);
    return (row) ? row.nombre : '';
  }

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && state.list.length < 1 && (
                                  <div onClick={ (event) => handleClickEdesurClienteAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickEdesurClienteView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickEdesurClienteModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickEdesurClienteRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickEdesurClienteDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>
                              </div>


  const tableColumns = [
    { Header: 'Código Cliente', accessor: 'codigoCliente', width: '15%' },
    { Header: 'Documento', Cell: (props) => {
      const row = props.row.original;
      const tipoDocumento = getDescTipoDocumento(row.idTipoDocumento);
      return `${tipoDocumento} ${row.numeroDocumento}`;
    }, id: 'documento', accessor: 'documento', width: '15%' },
    { Header: 'Nombre', accessor: 'nombrePersona', width: '30%' },
    { Header: 'Desde', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaDesde', width: '15%' },
    { Header: 'Hasta', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaHasta', width: '15%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickEdesurClienteAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idEdesur: state.idEdesur,
        idPersona: 0,
        idTipoPersona: 0,
        nombrePersona: "",
        idTipoDocumento: 0,
        numeroDocumento: "",
        codigoCliente: "",
        fechaDesde: null,
        fechaHasta: null,
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickEdesurClienteView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickEdesurClienteModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickEdesurClienteRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }
  const handleClickEdesurClienteDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }

  //funciones
  function RemoveEdesurCliente(row) {
    row.state = 'r';
    props.onChange('EdesurCliente', row);
  }

  function UpdateEdesurCliente(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('EdesurCliente', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
        <DataTaggerModalRedux
            title="Información adicional de Cliente Edesur"
            processKey={props.processKey}
            entidad="EdesurCliente"
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
              RemoveEdesurCliente(row);
            }}
        />
    }

    {state.showForm && 
        <EdesurClienteModal
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
              UpdateEdesurCliente(row);
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

EdesurClienteGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

EdesurClienteGrid.defaultProps = {
  disabled: false
};

export default EdesurClienteGrid;