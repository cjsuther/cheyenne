import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import ObraInmuebleDetalleModal from '../ObraInmuebleDetalleModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';
import { getFormatNumber } from '../../../utils/convert';

const ObrasInmuebleDetalleGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idObraInmueble: 0,
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
            idObraInmueble: props.data.idObraInmueble,
            list: list
        };
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowLista] = useLista({
    listas: ['TipoObra', 'DestinoObra'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoObra_DestinoObra',
      timeout: 0
    }
  });

  const getDescTipoObra = (id) => {
    const row = getRowLista('TipoObra', id);
    return (row) ? row.nombre : '';
  }
  const getDescDestinoObra = (id) => {
    const row = getRowLista('DestinoObra', id);
    return (row) ? row.nombre : '';
  }

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                    <div onClick={ (event) => handleClickObraInmuebleDetalleAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickObraInmuebleDetalleView(data.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickObraInmuebleDetalleModify(data.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    )}
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickObraInmuebleDetalleRemove(data.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    )}
                                    <div onClick={ (event) => handleClickObraInmuebleDetalleDataTagger(data.value) } className="link">
                                      <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                              </div>

  const tableColumns = [
    { Header: 'Tipo', Cell: (props) => getDescTipoObra(props.value), accessor: 'idTipoObra', width: '20%' },
    { Header: 'Destino', Cell: (props) => getDescDestinoObra(props.value), accessor: 'idDestinoObra', width: '20%' },
    { Header: 'Superficie', accessor: 'tipoSuperficie', width: '30%' },
    { Header: 'Valor ($)', Cell: (props) => getFormatNumber(props.value,2), accessor: 'valor', width: '10%', alignCell: 'right' },
    { Header: 'Metros', Cell: (props) => getFormatNumber(props.value,2), accessor: 'metros', width: '10%', alignCell: 'right' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];

  //handles
  const handleClickObraInmuebleDetalleAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idObraInmueble: state.idObraInmueble,
        idTipoObra: 0,
        idDestinoObra: 0,
        idFormaPresentacionObra: 0,
        idFormaCalculoObra: 0,
        sujetoDemolicion: false,
        generarSuperficie: false,
        tipoSuperficie: '',
        descripcion: '',
        valor: 0,
        alicuota: 0,
        metros: 0,
        montoPresupuestado: 0,
        montoCalculado: 0     
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickObraInmuebleDetalleView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickObraInmuebleDetalleModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickObraInmuebleDetalleRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleClickObraInmuebleDetalleDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }

  //funciones
  function RemoveObraInmuebleDetalle(row) {
    row.state = 'r';
    props.onChange('ObraInmuebleDetalle', row);
  }

  function UpdateObraInmuebleDetalle(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('ObraInmuebleDetalle', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
        <DataTaggerModalRedux
            title="Información adicional de Obra Detalle"
            processKey={props.processKey}
            entidad="ObraInmuebleDetalle"
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
                RemoveObraInmuebleDetalle(row);
            }}
        />
    }

    {state.showForm && 
        <ObraInmuebleDetalleModal
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
              UpdateObraInmuebleDetalle(row);
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

ObrasInmuebleDetalleGrid.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onChange: func.isRequired
};

ObrasInmuebleDetalleGrid.defaultProps = {
    disabled: false
  };

export default ObrasInmuebleDetalleGrid;