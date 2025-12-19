import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import VinculoComercioModal from '../VinculoComercioModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';

const VinculosComercioGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idComercio: 0,
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
        idComercio: props.data.idComercio,
        list: list };
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowLista] = useLista({
    listas: ['TipoDocumento', 'TipoVinculoComercio'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoDocumento_TipoVinculoComercio',
      timeout: 0
    }
  });

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickVinculoComercioAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickVinculoComercioView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickVinculoComercioModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickVinculoComercioRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickVinculoComercioDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>
                              </div>

  const getDescTipoVinculoComercio = (id) => {
    const row = getRowLista('TipoVinculoComercio', id);
    return (row) ? row.nombre : '';
  }
  const getDescTipoDocumento = (id) => {
    const row = getRowLista('TipoDocumento', id);
    return (row) ? row.nombre : '';
  }

  const tableColumns = [
    { Header: 'Tipo Vínculo', Cell: (props) => getDescTipoVinculoComercio(props.value), accessor: 'idTipoVinculoComercio', width: '20%' },
    { Header: 'Documento', Cell: (props) => {
      const row = props.row.original;
      const tipoDocumento = getDescTipoDocumento(row.idTipoDocumento);
      return `${tipoDocumento} ${row.numeroDocumento}`;
    }, id: 'documento', accessor: 'documento', width: '20%' },
    { Header: 'Nombre', accessor: 'nombrePersona', width: '50%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickVinculoComercioAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idComercio: state.idComercio,
        idTipoVinculoComercio: 0,
        idPersona: 0,
        idTipoPersona: 0,
        idTipoDocumento: 0,
        numeroDocumento: "",
        nombrePersona: "",
        idTipoInstrumento: 0,
        fechaInstrumentoDesde: null,
        fechaInstrumentoHasta: null,
        porcentajeCondominio: 0,
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickVinculoComercioView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickVinculoComercioModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickVinculoComercioRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleClickVinculoComercioDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
    }

  //funciones
  function RemoveVinculoComercio(row) {
    row.state = 'r';
    props.onChange('VinculoComercio', row);
  }

  function UpdateVinculoComercio(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('VinculoComercio', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
          title="Información adicional de Vínculo Comercio"
          processKey={props.processKey}
          entidad="VinculoComercio"
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
              RemoveVinculoComercio(row);
            }}
        />
    }

    {state.showForm && 
        <VinculoComercioModal
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
              UpdateVinculoComercio(row);
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

VinculosComercioGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

VinculosComercioGrid.defaultProps = {
  disabled: false
};

export default VinculosComercioGrid;