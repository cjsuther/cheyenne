import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { TableCustom } from '../../common';
import { GetTipoDato } from '../../../utils/helpers';
import ProcedimientoParametroModal from '../ProcedimientoParametroModal';


const ProcedimientoParametrosGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idEmisionEjecucion: 0,
        disabled: false,
        showMessage: false,
        showForm: false,
        listParametros: [],
        listValores: []
    });

    const mount = () => {
        setState(prevState => {
            return {...prevState,
                idEmisionEjecucion: props.data.idEmisionEjecucion,
                listParametros: props.data.listParametros,
                listValores: props.data.listValores};
        });
    }
    useEffect(mount, [props.data]);

    const tableColumns = [
        { Header: 'Código', accessor: 'codigo', width: '30%' },
        { Header: 'Nombre', accessor: 'nombre', width: '45%' },
        { Header: 'Tipo Dato', Cell: (props) => GetTipoDato(props.value), accessor: 'tipoDato', width: '15%' }
    ];

    const tableColumnsValue = [
        ...tableColumns,
        { Header: 'Valor', Cell: (props) => GetValor(props.value), accessor: 'tipoDato', id:'valor', accessor: 'id', width: '10%', alignCell: 'right', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickProcedimientoParametroModify = () => {
        setState(prevState => {
          return {...prevState, showForm: true};
        });
    }

    //funciones
    function GetValor(idProcedimientoParametro) {
        const row = state.listValores.find(f => f.idProcedimientoParametro === idProcedimientoParametro);
        return row.valor??'';
    }

    function UpdateProcedimientoParametro(rows) {
        rows.forEach(row => row.state = 'm');
        props.onChange('EmisionProcedimientoParametro', rows);
    }
    

    return (
    <>

        {state.showForm && 
            <ProcedimientoParametroModal
                data={{
                    listParametros: state.listParametros,
                    listValores: state.listValores
                }}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showForm: false};
                    });
                }}
                onConfirm={(rows) => {
                    setState(prevState => {
                        return {...prevState, showForm: false};
                    });
                    UpdateProcedimientoParametro(rows);
                }}
            />
        }

        <div className='row'>
            <label className="form-label col-12 col-md-8 p-top-5">Parámetros del procedimiento</label>
            {!props.disabled &&
            <div className='col-12 col-md-4 p-bottom-5'>
                <button className="btn btn-outline-primary float-end" data-dismiss="modal" onClick={ (event) => handleClickProcedimientoParametroModify() }>Actualizar valores</button>
            </div>
            }
        </div>

        <TableCustom
            showFilterGlobal={false}
            showPagination={props.showPagination}
            className={'TableCustomBase'}
            columns={ (props.showValue) ? tableColumnsValue : tableColumns}
            data={ state.listParametros }
        />

    </>
    );
}

ProcedimientoParametrosGrid.propTypes = {
    disabled: bool,
    showValue: bool,
    showPagination: bool,
    data: object.isRequired,
    onChange: func.isRequired
};

ProcedimientoParametrosGrid.defaultProps = {
    disabled: false,
    showValue: false,
    showPagination: false
};

export default ProcedimientoParametrosGrid;
