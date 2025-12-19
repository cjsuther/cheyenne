import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { TableCustom, MessageModal } from '../../common';
import { GetTipoDato } from '../../../utils/helpers';
import { useLista } from '../../hooks/useLista';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';


const ProcedimientoVariablesGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idEmisionDefinicion: 0,
        disabled: false,
        showMessage: false,
        textMessage: '',
        callbackMessage: null,
        list: [],
        listAll: []
    });

    const mount = () => {
        setState(prevState => {
        const list = props.data.list.filter(x => x.state !== 'r');
        return {...prevState,
            idEmisionDefinicion: props.data.idEmisionDefinicion,
            list: list,
            listAll: props.data.listAll};
        });
    }
    useEffect(mount, [props.data]);

    const [, getRowLista] = useLista({
        listas: ['TipoVariable'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoVariable',
          timeout: 0
        }
      });

    const cellBindAll = (data) =>   <div className='action'>
                                        {!props.disabled && (
                                        <div onClick={ (event) => handleClickProcedimientoVariableBindAll() } className="link">
                                            <i className="fa fa-plus" title="agregar todos"></i>
                                        </div>
                                        )}
                                    </div>
    const cellBind = (data) =>      <div className='action'>
                                        {!props.disabled && (
                                        <div onClick={ (event) => handleClickProcedimientoVariableBind(data.value) } className="link">
                                            <i className="fa fa-plus" title="agregar"></i>
                                        </div>
                                        )}
                                    </div>
    const cellUnbindAll = (data) => <div className='action'>
                                        {!props.disabled && (
                                        <div onClick={ (event) => handleClickProcedimientoVariableUnbindAll() } className="link">
                                            <i className="fa fa-minus" title="quitar todos"></i>
                                        </div>
                                        )}
                                    </div>
    const cellUnbind = (data) =>    <div className='action'>
                                        {!props.disabled && (
                                        <div onClick={ (event) => handleClickProcedimientoVariableUnbind(data.value) } className="link">
                                            <i className="fa fa-minus" title="quitar"></i>
                                        </div>
                                        )}
                                    </div>

  const getDescTipoVariable = (id) => {
    const row = getRowLista('TipoVariable', id);
    return (row) ? row.nombre : '';
  }

    const tableColumns = [
        { Header: 'Tipo Variable', Cell: (props) => getDescTipoVariable(props.value), accessor: 'idTipoVariable', width: '15%' },
        { Header: 'Código', accessor: 'codigo', width: '20%' },
        { Header: 'Nombre', accessor: 'nombre', width: '40%' },
        { Header: 'Tipo Dato', Cell: (props) => GetTipoDato(props.value), accessor: 'tipoDato', width: '15%' }
    ];
    const tableColumnsFree = [
        ...tableColumns,
        { Header: cellBindAll, Cell: cellBind, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
    ];
    const tableColumnsBinded = [
        ...tableColumns,
        { Header: cellUnbindAll, Cell: cellUnbind, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles   
    const handleClickProcedimientoVariableBindAll = () => {
        setState(prevState => {
            return {...prevState, showMessage: true, textMessage: '¿Está seguro de agregar todos?', callbackMessage: BindAll};
        });
    }
    const handleClickProcedimientoVariableBind = (idProcedimientoVariable) => {
        const row = {
            id: -1,
            idEmisionDefinicion: state.idEmisionDefinicion,
            idProcedimientoVariable: idProcedimientoVariable,
            state: 'a'
        };
        props.onChange('EmisionVariable', row);
    }
    const handleClickProcedimientoVariableUnbindAll = () => {
        setState(prevState => {
            return {...prevState, showMessage: true, textMessage: '¿Está seguro de quitar todos?', callbackMessage: UnbindAll};
        });
    }
    const handleClickProcedimientoVariableUnbind = (idProcedimientoVariable) => {
        let row = state.list.find(f => f.idProcedimientoVariable === idProcedimientoVariable);
        row.state = 'r';
        props.onChange('EmisionVariable', row);
    }

    //funciones
    const BindAll = () => {
        const listFree = state.listAll.filter(f => !state.list.map(x => x.idProcedimientoVariable).includes(f.id));
        listFree.forEach(x => handleClickProcedimientoVariableBind(x.id));
    }

    const UnbindAll = () => {
        const listBinded = state.listAll.filter(f => state.list.map(x => x.idProcedimientoVariable).includes(f.id));
        listBinded.forEach(x => handleClickProcedimientoVariableUnbind(x.id));
    }

    return (
    <>

        {state.showMessage && 
            <MessageModal
                title={"Confirmación"}
                message={state.textMessage}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showMessage: false, textMessage: '', callbackMessage: null};
                    });
                }}
                onConfirm={() => {
                    state.callbackMessage();
                    setState(prevState => {
                        return {...prevState, showMessage: false, textMessage: '', callbackMessage: null};
                    });
                }}
            />
        }

        <div className="m-bottom-20">
            <label className="form-label">Variables disponibles</label>
            <TableCustom
                showFilterGlobal={true}
                showPagination={true}
                className={'TableCustomBase'}
                columns={tableColumnsFree}
                data={ state.listAll.filter(f => !state.list.map(x => x.idProcedimientoVariable).includes(f.id)) }
            />
        </div>

        <div className="m-bottom-20">
            <label className="form-label">Variables asignadas</label>
            <TableCustom
                showFilterGlobal={false}
                showPagination={false}
                className={'TableCustomBase'}
                columns={tableColumnsBinded}
                data={ state.listAll.filter(f => state.list.map(x => x.idProcedimientoVariable).includes(f.id)) }
            />
        </div>
        
    </>
    );
}

    ProcedimientoVariablesGrid.propTypes = {
        processKey: string.isRequired,
        disabled: bool,
        data: object.isRequired,
        onChange: func.isRequired
    };

    ProcedimientoVariablesGrid.defaultProps = {
        disabled: false
    };

export default ProcedimientoVariablesGrid;
