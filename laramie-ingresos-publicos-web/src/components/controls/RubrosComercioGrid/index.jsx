import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import RubroComercioModal from '../RubroComercioModal';
import { getDateToString, getBooleanToString } from '../../../utils/convert';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';

const RubrosComercioGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idComercio: 0,
        disabled: false,
        showMessage: false,
        showForm: false,
        modeFormEdit: false,
        rowForm: null,
        showChildren: false,
        dataTagger: {
            showModal: false,
            idEntidad: null
        }, 
        list: [],
    });

    const [isFirstRubroState, setIsFirstRubroState] = useState(false);

    const dispatch = useDispatch();
    const sequenceValue = useSelector( (state) => state.sequence.value );

    const mount = () => {
        const list = props.data.list.filter(x => x.state !== 'r');
        setState(prevState => {
            return {...prevState,
                idComercio: props.data.idComercio,
                list: list };
        });     
    }
    useEffect(mount, [props.data]);

    const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                    <div onClick={ (event) => handleClickRubrosComercioAdd() } className="link">
                                       <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                              </div>
    const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickRubrosComercioView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickRubrosComercioModify(data.value) } className="link">
                                    <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickRubrosComercioRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickRubrosComercioDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>                                  
                              </div>

    const tableColumns = [
        { Header: 'Descripción', accessor: 'descripcion', width: '50%' },
        { Header: 'Principal', Cell: (props) => getBooleanToString(props.value), accessor: 'esRubroPrincipal', width: '10%' },
        { Header: 'Desde', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaInicio', width: '15%' },
        { Header: 'Hasta', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaCese', width: '15%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickRubrosComercioAdd = () => {
        setIsFirstRubroState(state.list.length === 0);

        const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
        setState(prevState => {
            const rowForm = {
                id: idTemporal,
                idComercio: state.idComercio,
                idTipoRubroComercio: 0,
                idUbicacionComercio: 0,
                idRubroLiquidacion: 0,
                idRubroProvincia: 0,
                idRubroBCRA: 0,
                descripcion: '',
                esDeOficio: false,
                esRubroPrincipal: false,
                esConDDJJ: false,
                fechaInicio: null,
                fechaCese: null,
                fechaAltaTransitoria: null,
                fechaBajaTransitoria: null,
                fechaBaja: null,
                idMotivoBajaRubroComercio: 0,
                state: 'a'
            };

            return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm, showChildren: false};
        });
        dispatch( sequenceActionNext() );
    }

    const handleClickRubrosComercioView = (id) => {
        setState(prevState => {
          const rowForm = state.list.find(x => x.id === id);
          return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm, showChildren: true};
        });
    }

    const handleClickRubrosComercioModify = (id) => {
        setIsFirstRubroState(state.list.length === 1);
        setState(prevState => {
            const rowForm = state.list.find(x => x.id === id);
            return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm, showChildren: true};
        });
      }
    
    const handleClickRubrosComercioRemove = (id) => {
        setState(prevState => {
            const rowForm = state.list.find(x => x.id === id);
            return {...prevState, showMessage: true, rowForm: rowForm};
        });
    }

    const handleClickRubrosComercioDataTagger = (id) => {
        setState(prevState => {
          return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
        });
    }    

    //funciones
    function RemoveRubroComercio(row) {
        row.state = 'r';
        if (row.esRubroPrincipal){
            const listWithoutRow = state.list.filter(value => row.id != value.id);
            const listRubroPrincipal = listWithoutRow.filter(value => value.esRubroPrincipal);
            if (listWithoutRow.length > 0 && listRubroPrincipal.length !== 1){
                ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe marcar un rubro como principal');
                return;
            }
        }
        props.onChange('RubroComercio', [row]);
    }

    function UpdateRubroComercio(row) {
        row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
        let updateList = [row];
        if (row.esRubroPrincipal){
            state.list.forEach(v => {
                let value = CloneObject(v);
                if (row.id != value.id && value.esRubroPrincipal){
                    value.esRubroPrincipal = false;
                    value.state = 'm';
                    updateList.push(value);
                }
            });
        }

        props.onChange('RubroComercio', updateList);
    }


    return (
    <>

        {state.dataTagger.showModal &&
            <DataTaggerModalRedux
                title="Información adicional de Rubros Comercio"
                processKey={props.processKey}
                entidad="RubroComercio"
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
                    RemoveRubroComercio(row);
                }}
            />
        }

        {state.showForm && 
            <RubroComercioModal
                processKey={props.processKey}
                disabled={!state.modeFormEdit}
                showChildren={state.showChildren}
                data={{
                    entity: state.rowForm,
                    idCuenta: props.data.idCuenta,
                    isFirstRubro: isFirstRubroState
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
                    UpdateRubroComercio(row);
                  }}
                onChangeChildren={props.onChangeChildren}
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

RubrosComercioGrid.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onChange: func.isRequired
};
  
RubrosComercioGrid.defaultProps = {
    disabled: false
};

export default RubrosComercioGrid;