import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import MedioPagoModal from '../MedioPagoModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';


const MediosPagoGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idTipoPersona: 0,
      idPersona: 0,
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
        idTipoPersona: props.data.idTipoPersona,
        idPersona: props.data.idPersona,
        list: list };
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowLista] = useLista({
    listas: ['TipoMedioPago'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoMedioPago',
      timeout: 0
    }
  });

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickMedioPagoAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickMedioPagoView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickMedioPagoModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && !data.row.original.principal && (
                                  <div onClick={ (event) => handleClickMedioPagoRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickMediosPagoDataTagger(data.value) } className="link">
                                      <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>                                  
                              </div>

  const getDescTipoMedioPago = (id) => {
    const row = getRowLista('TipoMedioPago', id);
    return (row) ? row.nombre : '';
  }

  const tableColumns = [
    { Header: 'Tipo Medio Pago', Cell: (props) => getDescTipoMedioPago(props.value), accessor: 'idTipoMedioPago', width: '20%' },
    { Header: 'Número', accessor: 'numero', width: '35%' },
    { Header: 'Títular', accessor: 'titular', width: '35%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickMedioPagoAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idTipoPersona: state.idTipoPersona,
        idPersona: state.idPersona,
        idTipoMedioPago: 0,
        titular: '',
        numero: '',
        banco: '',
        alias: '',
        idTipoTarjeta: 0,
        idMarcaTarjeta: 0,
        fechaVencimiento: null,
        cvv: '',
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickMedioPagoView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickMedioPagoModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickMedioPagoRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleClickMediosPagoDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }  

  //funciones
  function RemoveMedioPago(row) {
    row.state = 'r';
    props.onChange('MedioPago', row);
  }

  function UpdateMedioPago(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('MedioPago', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
          title="Información adicional de Medio de Pago"
          processKey={props.processKey}
          entidad="MedioPago"
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
              RemoveMedioPago(row);
            }}
        />
    }

    {state.showForm && 
        <MedioPagoModal
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
              UpdateMedioPago(row);
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

MediosPagoGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

MediosPagoGrid.defaultProps = {
  disabled: false
};

export default MediosPagoGrid;