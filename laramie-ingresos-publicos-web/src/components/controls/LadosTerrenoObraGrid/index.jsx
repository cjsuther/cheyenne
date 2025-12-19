import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { object, func, bool, string } from 'prop-types';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import LadoTerrenoObraModal from '../LadoTerrenoObraModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';
import { getFormatNumber } from '../../../utils/convert';

const LadosTerrenoObraGrid = (props) => {

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
    entidades: ['Obra'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'Obra',
      timeout: 0
    }
  });

  const getDescObra = (id) => {
    const row = getRowEntidad('Obra', id);
    return (row) ? row.nombre : '';
  }

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                    <div onClick={ (event) => handleClickLadoTerrenoObraAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickLadoTerrenoObraView(data.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickLadoTerrenoObraModify(data.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    )}
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickLadoTerrenoObraRemove(data.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    )}
                                    <div onClick={ (event) => handleClickLadoTerrenoObraDataTagger(data.value) } className="link">
                                      <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                              </div>

  const tableColumns = [
    { Header: 'Obra', Cell: (data) => getDescObra(data.value), accessor: 'idObra', width: '65%' },
    { Header: 'Importe ($)', Cell: (props) => getFormatNumber(props.value,2), accessor: 'importe', width: '25%', alignCell: 'right' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];

  //handles
  const handleClickLadoTerrenoObraAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idLadoTerreno: state.idLadoTerreno,
        idObra: 0,
        importe: 0,
        reduccionMetros: 0,
        reduccionSuperficie: 0,
        fecha: null,
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickLadoTerrenoObraView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickLadoTerrenoObraModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickLadoTerrenoObraRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }
  const handleClickLadoTerrenoObraDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }
    

  //funciones
  function RemoveLadoTerrenoObra(row) {
    row.state = 'r';
    props.onChange('LadoTerrenoObra', row);
  }

  function UpdateLadoTerrenoObra(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('LadoTerrenoObra', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
        title="Información adicional de Obra de Lado del Terreno"
        processKey={props.processKey}
        entidad="LadoTerrenoObra"
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
                RemoveLadoTerrenoObra(row);
            }}
        />
    }

    {state.showForm && 
        <LadoTerrenoObraModal
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
              UpdateLadoTerrenoObra(row);
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

LadosTerrenoObraGrid.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onChange: func.isRequired
};

LadosTerrenoObraGrid.defaultProps = {
    disabled: false
  };

export default LadosTerrenoObraGrid;