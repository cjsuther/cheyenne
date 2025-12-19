import React, { useState, useEffect } from 'react';
import { bool, string, number, func, array } from 'prop-types';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import ShowToastMessage from '../../../utils/toast';
import EntidadesModal from '../../controls/EntidadesModal';

import './index.css'


const InputEntidad = (props) => {

    const [state, setState] = useState({
        value: null,
        showList: false
    });

    const [getListEntidad, getRowEntidad, readyEntidad] = useEntidad({
        entidades: props.data ? [] : [props.entidad],
        onLoaded: (entidades, isSuccess, error) => {
            if (isSuccess) {
                setState(prevState => ({...prevState}));
            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        },
        memo: (props.memo) ? {
          key: props.entidad,
          timeout: 0
        }: null
    });

    useEffect(() => {
        setState(prevState => {
            return {...prevState, value: props.value };
        });
        if (props.onUpdate) {
            props.onUpdate({
                target: {
                    name: props.name,
                    type: 'entidad',
                    value: props.value,
                    row: getRowEntidadProxy(props.value)
                }
            });
        }
    }, [props.value, readyEntidad]);

    const onSelected = (id, row) => {
        if (props.onChange) {
            props.onChange({
                target: {
                    name: props.name,
                    type: 'entidad',
                    value: id,
                    row: row
                }
            });
        }
        setState(prevState => {
            return {...prevState, showList: false};
        });
    }

    function getListEntidadProxy() {
        if (props.data) {
            return props.data;
        }
        else {
            return null; //podria pasarse getListEntidad, pero por ahora dejamos que la vuelva a consultar
        }
    }
    function getRowEntidadProxy(id) {
        if (props.data) {
            return props.data.find(f => f.id === id);
        }
        else {
            return getRowEntidad(props.entidad, id);
        }
    }

    return (
        <div className='wrapper'>

            {state.showList && (
                <EntidadesModal
                    title={props.title}
                    entidad={props.entidad}
                    onDismiss={() => {
                        setState(prevState => {
                            return {...prevState, showList: false};
                        });
                    }}
                    onConfirm={onSelected}
                    filter={props.filter}
                    columns={props.columns}
                    data={getListEntidadProxy()}
                    memo={props.memo}
                />
            )}

            <input
                name={props.name}
                type="text"
                placeholder={props.placeholder}
                className={`input-entidad ${props.className}`}
                value={props.onFormat(getRowEntidadProxy(state.value) ?? '')}
                onClick={() => {
                    setState(prevState => {
                        return {...prevState, showList: true};
                    });
                }}
                readOnly={true}
                disabled={props.disabled}
            />

            {!props.disabled && <span
                className="material-symbols-outlined icon-cruz"
                onClick={() => onSelected(0, null)}
            >close</span>}
        </div>
    )
}

InputEntidad.propTypes = {
    title: string,
    entidad: string.isRequired,
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: number,
    onUpdate: func,
    onChange: func,
    onFormat: func,
    filter: func,
    columns: array,
    data: array,
    disabled: bool,
    memo: bool
};

InputEntidad.defaultProps = {
    title: "",
    placeholder: "",
    className: "",
    value: null,
    onUpdate: null,
    onChange: null,
    onFormat: (row) => (row && row.id) ? (row.nombre ?? row.descripcion) : '',
    filter: (row) => { return true },
    columns: [
        { Header: 'Código', accessor: 'codigo', width: '25%' },
        { Header: 'Nombre', accessor: 'nombre', width: '70%' }
    ],
    data: null,
    disabled: false,
    memo: true
};

export default InputEntidad;
