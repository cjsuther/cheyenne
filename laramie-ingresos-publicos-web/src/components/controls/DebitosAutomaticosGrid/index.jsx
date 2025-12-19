import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShowToastMessage from '../../../utils/toast';
import { object, func, bool, string } from 'prop-types';
import { ALERT_TYPE } from '../../../consts/alertType';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { CloneObject } from '../../../utils/helpers';
import { TableCustom, MessageModal } from '../../common';
import { getDateToString } from '../../../utils/convert';
import { isNull } from '../../../utils/validator';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { useEntidad } from '../../hooks/useEntidad';
import DebitoAutomaticoModal from '../DebitoAutomaticoModal';

const DebitosAutomaticosGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idCuenta: 0,
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
                list: list };
        });
    }
    useEffect(mount, [props.data]);

    const [, getRowEntidad] = useEntidad({
        entidades: ['Tasa', 'SubTasa'],
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

    const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                    <div onClick={ (event) => handleClickDebitosAutomaticosAdd() } className="link">
                                       <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                                </div>
    const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickDebitoAutomaicoView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickDebitosAutomaticosModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickDebitosAutomaticosRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickDebitosAutomaticosDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>
                                  )} 
                              </div>

    const getDescTasa = (id) => {
        const row = getRowEntidad('Tasa', id);
        return (row) ? `${row.codigo} - ${row.descripcion}` : '';
    } 
    const getDescSubTasa = (id) => {
        const row = getRowEntidad('SubTasa', id);
        return (row) ? `${row.codigo} - ${row.descripcion}` : '';
    }
    
    const tableColumns = [
        { Header: 'Medio de pago', accessor: 'detalleMedioPago', width: '30%' },
        { Header: 'Tasa', Cell: (props) => getDescTasa(props.value), accessor: 'idTasa', width: '20%' },
        { Header: 'Sub Tasa', Cell: (props) => getDescSubTasa(props.value), accessor: 'idSubTasa', width: '20%' },
        { Header: 'Desde', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaDesde', width: '10%' },
        { Header: 'Hasta', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaAlta', width: '10%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];


    // handlers
    const handleClickDebitoAutomaicoView = (id) => {
        setState(prevState => {
          const rowForm = state.list.find(x => x.id === id);
          return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
        });
    }

    const handleClickDebitosAutomaticosAdd = () => {
        const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
        setState(prevState => {
            const rowForm = {
                id: idTemporal,
                idCuenta: state.idCuenta,
                idTasa: 0,
                idSubTasa: 0,
                idRubro: 0,
                idTipoSolicitudDebitoAutomatico: 0,
                numeroSolicitudDebitoAutomatico: '',
                idMedioPago: 0,
                detalleMedioPago: '',
                fechaDesde: null,
                fechaAlta: null,
                fechaBaja: null,
                state: 'a'
            };
            return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
        dispatch( sequenceActionNext() );
    }

    const handleClickDebitosAutomaticosModify = (id) => {
        setState(prevState => {
            const rowForm = state.list.find(x => x.id === id);
            return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
    }

    const handleClickDebitosAutomaticosRemove = (id) => {
        setState(prevState => {
            const rowForm = state.list.find(x => x.id === id);
            return {...prevState, showMessage: true, rowForm: rowForm};
        });
    }

    const handleClickDebitosAutomaticosDataTagger = (id) => {
        setState(prevState => {
          return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
        });
    }

    //funciones
    function RemoveDebitosAutomaticos(row) {
        row.state = 'r';
        props.onChange('DebitosAutomaticos', row);
    }

    function UpdateDebitosAutomaticos(row) {
        row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
        props.onChange('DebitosAutomaticos', row);
    }

    return (
    <>

        {state.dataTagger.showModal &&
            <DataTaggerModalRedux
                title="Información adicional de Debitos Automáticos"
                processKey={props.processKey}
                entidad="DebitoAutomatico"
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
                    RemoveDebitosAutomaticos(row);
                }}
            />
        }


        {state.showForm && 
            <DebitoAutomaticoModal
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
                    UpdateDebitosAutomaticos(row);
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

DebitosAutomaticosGrid.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onChange: func.isRequired
  };
  
DebitosAutomaticosGrid.defaultProps = {
    disabled: false
};


export default DebitosAutomaticosGrid;