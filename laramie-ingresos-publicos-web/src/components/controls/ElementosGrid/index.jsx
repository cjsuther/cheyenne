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
import ElementoModal from '../ElementoModal';


const ElementosGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idCuenta: 0,
        idClaseElemento: 0,
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
        const list = props.data.list.filter(x => x.state !== 'r' && x.idClaseElemento == props.data.idClaseElemento);
        return {...prevState,
            idCuenta: props.data.idCuenta,
            idClaseElemento: props.data.idClaseElemento,
            list: list };
        });
    }
    useEffect(mount, [props.data]);

    const [, getRowEntidad] = useEntidad({
        entidades: ['TipoElemento'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoElemento',
          timeout: 0
        }
    });

    const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                    <div onClick={ (event) => handleClickElementoAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                              </div>
    const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickElementoView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickElementoModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickElementoRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickElementoDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>   
                              </div>

    const getDescTipoElemento = (id) => {
        const row = getRowEntidad('TipoElemento', id);
        return (row) ? row.nombre : '';
    }

    const tableColumns = [
        { Header: 'Tipo Elemento', Cell: (props) => getDescTipoElemento(props.value), accessor: 'idTipoElemento', width: '50%' },
        { Header: 'Cantidad', accessor: 'cantidad', width: '10%' },
        { Header: 'Fecha Alta', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaAlta', width: '15%' },
        { Header: 'Fecha Baja', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaBaja', width: '15%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickElementoAdd = () => {
        const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
        setState(prevState => {
            const rowForm = {
                id: idTemporal,
                idCuenta: state.idCuenta,
                idClaseElemento: state.idClaseElemento,
                idTipoElemento: 0,
                cantidad: 0,
                fechaAlta: null,
                fechaBaja: null,
                state: 'a'
            };
            return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
        dispatch( sequenceActionNext() );
    }

    const handleClickElementoView = (id) => {
        setState(prevState => {
          const rowForm = state.list.find(x => x.id === id);
          return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
        });
    }

    const handleClickElementoModify = (id) => {
        setState(prevState => {
          const rowForm = state.list.find(x => x.id === id);
          return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
    }

    const handleClickElementoRemove = (id) => {
        setState(prevState => {
            const rowForm = state.list.find(x => x.id === id);
            return {...prevState, showMessage: true, rowForm: rowForm};
        });
    }

    const handleClickElementoDataTagger = (id) => {
        setState(prevState => {
          return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
        });
    }    

    //funciones
    function RemoveElemento(row) {
        row.state = 'r';
        props.onChange('Elemento', row);
    }

    function UpdateElemento(row) {
        row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
        props.onChange('Elemento', row);
    }

    return (
    <>

        {state.dataTagger.showModal &&
            <DataTaggerModalRedux
                title="Información adicional de Elementos"
                processKey={props.processKey}
                entidad="Elemento"
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
                    RemoveElemento(row);
                }}
            />
        }

        {state.showForm && 
            <ElementoModal
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
                    UpdateElemento(row);
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

ElementosGrid.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onChange: func.isRequired
  };
  
  ElementosGrid.defaultProps = {
    disabled: false
  };

export default ElementosGrid;
