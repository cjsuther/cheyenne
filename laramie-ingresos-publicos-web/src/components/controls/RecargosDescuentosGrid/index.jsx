import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { useEntidad } from '../../hooks/useEntidad';
import { getDateToString, getFormatNumber } from '../../../utils/convert';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import { isNull } from '../../../utils/validator';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import RecargoDescuentoModal from '../RecargoDescuentoModal';


const RecargosDescuentosGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idCuenta: 0,
      idTipoTributo: 0,
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
            idCuenta: props.data.idCuenta,
            idTipoTributo: props.data.idTipoTributo,
            list: list };
        });
    }
    useEffect(mount, [props.data]);

    const [, getRowEntidad] = useEntidad({
        entidades: ['TipoRecargoDescuento'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoRecargoDescuento',
          timeout: 0
        }
    });

    const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                    <div onClick={ (event) => handleClickRecargoDescuentoAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                              </div>
    const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickRecargoDescuentoView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickRecargoDescuentoModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickRecargoDescuentoRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickRecargoDescuentoDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>   
                              </div>

    const getDescTipoRecargoDescuento = (id) => {
        const row = getRowEntidad('TipoRecargoDescuento', id);
        return (row) ? row.nombre : '';
    }

    const tableColumns = [
        { Header: 'Tipo', Cell: (props) => getDescTipoRecargoDescuento(props.value), accessor: 'idTipoRecargoDescuento', width: '40%' },
        { Header: 'Valor', Cell: (props) => (props.row.original.importe === 0) ?
                                            getFormatNumber(props.row.original.porcentaje,2) + ' %' :
                                            '$ ' + getFormatNumber(props.row.original.importe,2), id: 'valor', accessor: 'id', width: '20%', alignCell: 'right' },
        { Header: 'Desde', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaDesde', width: '15%' },
        { Header: 'Hasta', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaHasta', width: '15%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickRecargoDescuentoAdd = () => {
        const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
        setState(prevState => {
            const rowForm = {
                id: idTemporal,
                idCuenta: state.idCuenta,
                idTipoRecargoDescuento: 0,
                idTasa: 0,
                idSubTasa: 0,
                idRubro: 0,
                fechaDesde: null,
                fechaHasta: null,
                fechaOtorgamiento: null,
                numeroSolicitud: '',
                porcentaje: 0,
                importe: 0,
                idTipoPersona: 0,
                idPersona: 0,
                nombrePersona: '',
                idTipoDocumento: 0,
                numeroDocumento: '',
                numeroDDJJ: '',
                letraDDJJ: '',
                ejercicioDDJJ: '',
                numeroDecreto: '',
                letraDecreto: '',
                ejercicioDecreto: '',
                idExpediente: 0,
                detalleExpediente: '',
                state: 'a'
            };
            return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
        dispatch( sequenceActionNext() );
    }

    const handleClickRecargoDescuentoView = (id) => {
        setState(prevState => {
          const rowForm = state.list.find(x => x.id === id);
          return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
        });
    }

    const handleClickRecargoDescuentoModify = (id) => {
        setState(prevState => {
          const rowForm = state.list.find(x => x.id === id);
          return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
    }

    const handleClickRecargoDescuentoRemove = (id) => {
        setState(prevState => {
            const rowForm = state.list.find(x => x.id === id);
            return {...prevState, showMessage: true, rowForm: rowForm};
        });
    }

    const handleClickRecargoDescuentoDataTagger = (id) => {
        setState(prevState => {
          return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
        });
    }    

    //funciones
    function RemoveRecargoDescuento(row) {
        row.state = 'r';
        props.onChange('RecargoDescuento', row);
    }

    function UpdateRecargoDescuento(row) {
        row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
        props.onChange('RecargoDescuento', row);
    }

    return (
    <>

        {state.dataTagger.showModal &&
            <DataTaggerModalRedux
                title="Información adicional de Recargo Descuento"
                processKey={props.processKey}
                entidad="RecargoDescuento"
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
                    RemoveRecargoDescuento(row);
                }}
            />
        }

        {state.showForm && 
            <RecargoDescuentoModal
                processKey={props.processKey}
                disabled={!state.modeFormEdit}
                data={{
                    entity: state.rowForm,
                    idTipoTributo: state.idTipoTributo
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
                    UpdateRecargoDescuento(row);
                  }}
            />
        }

        <TableCustom
            showFilterGlobal={false}
            showPagination={false}
            className={'TableCustomBase'}
            columns={tableColumns}
            data={ state.list }
        />

    </>
    );
}

RecargosDescuentosGrid.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onChange: func.isRequired
  };
  
  RecargosDescuentosGrid.defaultProps = {
    disabled: false
  };

export default RecargosDescuentosGrid;
