import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { object, func, bool, string } from 'prop-types';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import LadoTerrenoServicioModal from '../LadoTerrenoServicioModal';
import ShowToastMessage from '../../../utils/toast';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';

const LadosTerrenoServicioGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idLadoTerreno: 0,
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
            idLadoTerreno: props.data.idLadoTerreno,
            list: list
        };
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowEntidad] = useEntidad({
    entidades: ['Tasa','SubTasa'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'Tasa_SubTasa',
      timeout: 0
    }
  });

  const getDescTasa = (id) => {
    const row = getRowEntidad('Tasa', id);
    return (row) ? `${row.codigo} - ${row.descripcion}` : '';
  }
  const getDescSubTasa = (id) => {
    const row = getRowEntidad('SubTasa', id);
    return (row) ? `${row.codigo} - ${row.descripcion}` : '';
}

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                    <div onClick={ (event) => handleClickLadoTerrenoServicioAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickLadoTerrenoServicioView(data.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickLadoTerrenoServicioModify(data.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    )}
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickLadoTerrenoServicioRemove(data.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    )}
                                    <div onClick={ (event) => handleClickLadoTerrenoServicioDataTagger(data.value) } className="link">
                                      <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                              </div>

  const tableColumns = [
    { Header: 'Tasa', Cell: (data) => getDescTasa(data.value), accessor: 'idTasa', width: '40%' },
    { Header: 'Sub Tasa', Cell: (data) => getDescSubTasa(data.value), accessor: 'idSubTasa', width: '50%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];

  //handles
  const handleClickLadoTerrenoServicioAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idLadoTerreno: state.idLadoTerreno,
        idTasa: 0,
        idSubTasa: 0,
        fechaDesde: null,
        fechaHasta: null
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickLadoTerrenoServicioView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickLadoTerrenoServicioModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickLadoTerrenoServicioRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }
  const handleClickLadoTerrenoServicioDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }

  //funciones
  function RemoveLadoTerrenoServicio(row) {
    row.state = 'r';
    props.onChange('LadoTerrenoServicio', row);
  }

  function UpdateLadoTerrenoServicio(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('LadoTerrenoServicio', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
        <DataTaggerModalRedux
          title="Información adicional de Servicio de Lado del Terreno"
          processKey={props.processKey}
          entidad="LadoTerrenoServicio"
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
                RemoveLadoTerrenoServicio(row);
            }}
        />
    }

    {state.showForm && 
        <LadoTerrenoServicioModal
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
              UpdateLadoTerrenoServicio(row);
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

LadosTerrenoServicioGrid.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onChange: func.isRequired
};

LadosTerrenoServicioGrid.defaultProps = {
    disabled: false
  };

export default LadosTerrenoServicioGrid;