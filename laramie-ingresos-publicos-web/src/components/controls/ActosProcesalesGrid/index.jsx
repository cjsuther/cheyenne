import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { getDateToString } from '../../../utils/convert';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import ActoProcesalModal from '../ActoProcesalModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';

const ActosProcesalesGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idApremio: 0,
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
            idApremio: props.data.idApremio,
            list: list };
        });
    }
    useEffect(mount, [props.data]);

    const [, getRowEntidad] = useEntidad({
        entidades: ['TipoActoProcesal'],
        onLoaded: (entidades, isSuccess, error) => {
            if (isSuccess) {
                setState(prevState => ({...prevState}));
            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        },
        memo: {
            key: 'TipoActoProcesal',
            timeout: 0
        }
    });  

    const cellA = (data) =>    <div className='action'>
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickActoProcesalAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                    )}
                                </div>
    const cellVMR = (data) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickActoProcesalView(data.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickActoProcesalModify(data.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    )}
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickActoProcesalRemove(data.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    )}
                                    <div onClick={ (event) => handleClickActoProcesalDataTagger(data.value) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                </div>

    const getDescTipoActoProcesal = (id) => {
        const row = getRowEntidad('TipoActoProcesal', id);
        return (row) ? row.descripcion : '';
    }
    
    const tableColumns = [
        { Header: 'Acto procesal', Cell: (data) => getDescTipoActoProcesal(data.value), accessor: 'idTipoActoProcesal', width: '50%' },
        { Header: 'Fecha desde', Cell: (data) => getDateToString(data.value, false), accessor: 'fechaDesde', width: '20%' },      
        { Header: 'Fecha hasta', Cell: (data) => getDateToString(data.value, false), accessor: 'fechaHasta', width: '20%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickActoProcesalAdd = () => {
        const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
        setState(prevState => {
        const rowForm = {
            id: idTemporal,
            idApremio: state.idApremio,
            idTipoActoProcesal: 0,
            fechaDesde: null,
            fechaHasta: null,
            observacion: '',
            state: 'a'
        };
        return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
        dispatch( sequenceActionNext() );
    }

    const handleClickActoProcesalView = (id) => {
        setState(prevState => {
        const rowForm = state.list.find(x => x.id === id);
        return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
        });
    }

    const handleClickActoProcesalModify = (id) => {
        setState(prevState => {
        const rowForm = state.list.find(x => x.id === id);
        return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
    }
    
    const handleClickActoProcesalRemove = (id) => {
        setState(prevState => {
        const rowForm = state.list.find(x => x.id === id);
        return {...prevState, showMessage: true, rowForm: rowForm};
        });
    }

    const handleClickActoProcesalDataTagger = (id) => {
        setState(prevState => {
          return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
        });
      }

    //funciones
    function RemoveActoProcesal(row) {
        row.state = 'r';
        props.onChange('ActoProcesal', row);
    }

    function UpdateActoProcesal(row) {
        row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
        props.onChange('ActoProcesal', row);
    }

    return (
    <>

        {state.dataTagger.showModal &&
            <DataTaggerModalRedux
                title="Información adicional de Acto Procesal"
                processKey={props.processKey}
                entidad="ActoProcesal"
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
                    RemoveActoProcesal(row);
                }}
            />
        }

        {state.showForm && 
            <ActoProcesalModal
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
                    UpdateActoProcesal(row);
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

ActosProcesalesGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

ActosProcesalesGrid.defaultProps = {
  disabled: false
};

export default ActosProcesalesGrid;