import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import VinculoEspecialModal from '../VinculoEspecialModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';

const VinculosEspecialGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idEspecial: 0,
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
        idEspecial: props.data.idEspecial,
        list: list };
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowLista] = useLista({
    listas: ['TipoDocumento', 'TipoVinculoEspecial'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoDocumento_TipoVinculoEspecial',
      timeout: 0
    }
  });

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickVinculoEspecialAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickVinculoEspecialView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickVinculoEspecialModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickVinculoEspecialRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickVinculoEspecialDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>
                              </div>

  const getDescTipoVinculoEspecial = (id) => {
    const row = getRowLista('TipoVinculoEspecial', id);
    return (row) ? row.nombre : '';
  }
  const getDescTipoDocumento = (id) => {
    const row = getRowLista('TipoDocumento', id);
    return (row) ? row.nombre : '';
  }

  const tableColumns = [
    { Header: 'Tipo Vínculo', Cell: (props) => getDescTipoVinculoEspecial(props.value), accessor: 'idTipoVinculoEspecial', width: '20%' },
    { Header: 'Documento', Cell: (props) => {
      const row = props.row.original;
      const tipoDocumento = getDescTipoDocumento(row.idTipoDocumento);
      return `${tipoDocumento} ${row.numeroDocumento}`;
    }, id: 'documento', accessor: 'documento', width: '20%' },
    { Header: 'Nombre', accessor: 'nombrePersona', width: '50%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickVinculoEspecialAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idEspecial: state.idEspecial,
        idTipoVinculoEspecial: 0,
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
  const handleClickVinculoEspecialView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickVinculoEspecialModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickVinculoEspecialRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleClickVinculoEspecialDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
    }

  //funciones
  function RemoveVinculoEspecial(row) {
    row.state = 'r';
    props.onChange('VinculoEspecial', row);
  }

  function UpdateVinculoEspecial(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('VinculoEspecial', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
          title="Información adicional de Vínculo Especial"
          processKey={props.processKey}
          entidad="VinculoEspecial"
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
              RemoveVinculoEspecial(row);
            }}
        />
    }

    {state.showForm && 
        <VinculoEspecialModal
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
              UpdateVinculoEspecial(row);
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

VinculosEspecialGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

VinculosEspecialGrid.defaultProps = {
  disabled: false
};

export default VinculosEspecialGrid;