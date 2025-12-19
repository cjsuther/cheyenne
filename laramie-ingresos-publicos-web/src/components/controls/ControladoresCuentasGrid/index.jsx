import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import ShowToastMessage from '../../../utils/toast';
import ControladorCuentaModal from '../ControladorCuentaModal';
import { getDateToString } from '../../../utils/convert';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';

const ControladoresCuentasGrid = (props) => {

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

    const [, getRowTipoControlador] = useEntidad({
        entidades: ['TipoControlador'],
        onLoaded: (entidades, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoControlador',
          timeout: 0
        }
    });

    const [, getRowControlador] = useEntidad({
        entidades: ['Controlador'],
        onLoaded: (entidades, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: null
    });

    const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                    <div onClick={ (event) => handleClickControladorCuentaAdd() } className="link">
                                       <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                              </div>
    const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickControladorCuentaView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickControladorCuentaModify(data.value) } className="link">
                                    <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickControladorCuentaRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickControladorCuentaDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>                                  
                              </div>

    const getDescTipoControlador = (id) => {
        const row = getRowTipoControlador('TipoControlador', id);
        return (row) ? row.nombre : '';
    }

    const getDescControlador = (id) => {
        const row = getRowControlador('Controlador', id);
        return (row) ? `${row.nombrePersona} (Legajo: ${row.legajo})` : '';
    }

    const tableColumns = [
        { Header: 'Tipo Controlador', Cell: (props) => getDescTipoControlador(props.value), accessor: 'idTipoControlador', width: '25%' },
        { Header: 'Controlador', Cell: (props) => getDescControlador(props.value), accessor: 'idControlador', width: '35%' },
        { Header: 'Desde', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaDesde', width: '15%' },
        { Header: 'Hasta', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaHasta', width: '15%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickControladorCuentaAdd = () => {
        const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
        setState(prevState => {
            const rowForm = {
                id: idTemporal,
                idCuenta: state.idCuenta,
                idTipoControlador: 0,
                idControlador: 0,
                fechaDesde: null,
                fechaHasta: null,
                state: 'a'
            };
            return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
        dispatch( sequenceActionNext() );
    }

    const handleClickControladorCuentaView = (id) => {
        setState(prevState => {
          const rowForm = state.list.find(x => x.id === id);
          return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
        });
    }

    const handleClickControladorCuentaModify = (id) => {
        setState(prevState => {
            const rowForm = state.list.find(x => x.id === id);
            return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
      }
    
    const handleClickControladorCuentaRemove = (id) => {
        setState(prevState => {
            const rowForm = state.list.find(x => x.id === id);
            return {...prevState, showMessage: true, rowForm: rowForm};
        });
    }

    const handleClickControladorCuentaDataTagger = (id) => {
        setState(prevState => {
          return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
        });
    }    

    //funciones
    function RemoveControladorCuenta(row) {
        row.state = 'r';
        props.onChange('ControladorCuenta', row);
    }

    function UpdateControladorCuenta(row) {
        row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
        props.onChange('ControladorCuenta', row);
    }

    return (
    <>

        {state.dataTagger.showModal &&
            <DataTaggerModalRedux
                title="Información adicional de Controladores de la Cuenta"
                processKey={props.processKey}
                entidad="ControladorCuenta"
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
                    RemoveControladorCuenta(row);
                }}
            />
        }

        {state.showForm && 
            <ControladorCuentaModal
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
                    UpdateControladorCuenta(row);
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

ControladoresCuentasGrid.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onChange: func.isRequired
  };
  
  ControladoresCuentasGrid.defaultProps = {
    disabled: false
  };

export default ControladoresCuentasGrid;