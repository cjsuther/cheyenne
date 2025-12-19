import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { getDateToString } from '../../../utils/convert';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import JuicioCitacionModal from '../JuicioCitacionModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';

const JuiciosCitacionesGrid = (props) => {

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

    const [, getRowLista ] = useLista({
        listas: ['TipoCitacion'],
        onLoaded: (listas, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoCitacion',
          timeout: 0
        }
    });

    const getDescTipoCitacion = (id) => {
        const row = getRowLista('TipoCitacion', id);
        return (row) ? row.nombre : '';
    }

    const cellA = (data) =>    <div className='action'>
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickJuicioCitacionAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                    )}
                                </div>
    const cellVMR = (data) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickJuicioCitacionView(data.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickJuicioCitacionModify(data.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    )}
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickJuicioCitacionRemove(data.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    )}
                                    <div onClick={ (event) => handleClickJuicioCitacionDataTagger(data.value) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                </div>
    
    const tableColumns = [
        { Header: 'Fecha', Cell: (data) => getDateToString(data.value, false), accessor: 'fechaCitacion', width: '10%' },
        { Header: 'Tipo citación', Cell: (data) => getDescTipoCitacion(data.value), accessor: 'idTipoCitacion', width: '20%' },      
        { Header: 'Observaciones', accessor: 'observacion', width: '60%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickJuicioCitacionAdd = () => {
        const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
        setState(prevState => {
        const rowForm = {
            id: idTemporal,
            idApremio: state.idApremio,
            fechaCitacion: null,
            idTipoCitacion: 0,
            observacion: '',
            state: 'a'
        };
        return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
        dispatch( sequenceActionNext() );
    }

    const handleClickJuicioCitacionView = (id) => {
        setState(prevState => {
        const rowForm = state.list.find(x => x.id === id);
        return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
        });
    }

    const handleClickJuicioCitacionModify = (id) => {
        setState(prevState => {
        const rowForm = state.list.find(x => x.id === id);
        return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
    }
    
    const handleClickJuicioCitacionRemove = (id) => {
        setState(prevState => {
        const rowForm = state.list.find(x => x.id === id);
        return {...prevState, showMessage: true, rowForm: rowForm};
        });
    }

    const handleClickJuicioCitacionDataTagger = (id) => {
        setState(prevState => {
          return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
        });
      }

    //funciones
    function RemoveJuicioCitacion(row) {
        row.state = 'r';
        props.onChange('JuicioCitacion', row);
    }

    function UpdateJuicioCitacion(row) {
        row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
        props.onChange('JuicioCitacion', row);
    }

    return (
    <>

        {state.dataTagger.showModal &&
            <DataTaggerModalRedux
                title="Información adicional de Juicio Citacion"
                processKey={props.processKey}
                entidad="JuicioCitacion"
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
                    RemoveJuicioCitacion(row);
                }}
            />
        }

        {state.showForm && 
            <JuicioCitacionModal
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
                    UpdateJuicioCitacion(row);
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

JuiciosCitacionesGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

JuiciosCitacionesGrid.defaultProps = {
  disabled: false
};

export default JuiciosCitacionesGrid;