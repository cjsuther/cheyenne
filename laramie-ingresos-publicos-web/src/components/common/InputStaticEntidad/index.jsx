import React, { useEffect, useState } from 'react';
import { bool, string, number, func, array } from 'prop-types';
import StaticEntidadesModal from '../../controls/StaticEntidadesModal';

import './index.css'


const InputStaticEntidad = (props) => {

    const [state, setState] = useState({
        value: null,
        showList: false
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
                    row: getRowEntidad(props.value)
                }
            });
        }
    }, [props.value]);

    const getRowEntidad = (id) => {
        return (props.list ?? []).find(f => f.id === id);
    }
    
    return (
        <>

            {state.showList && (
                <StaticEntidadesModal
                    title={props.title}
                    onDismiss={() => {
                        setState(prevState => {
                            return {...prevState, showList: false};
                        });
                    }}
                    onConfirm={(id, row) => {
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
                    }}
                    list={props.list}
                    columns={props.columns}
                />
            )}

            <input
                name={props.name}
                type="text"
                placeholder={props.placeholder}
                className={`input-entidad ${props.className}`}
                value={props.onFormat(getRowEntidad(state.value) ?? '')}
                onClick={() => {
                    setState(prevState => {
                        return {...prevState, showList: true};
                    });
                }}
                readOnly={true}
                disabled={props.disabled}
            />

        </>
    )
}

InputStaticEntidad.propTypes = {
    title: string,
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: number,
    onUpdate: func,
    onChange: func,
    onFormat: func,
    columns: array,
    disabled: bool
};

InputStaticEntidad.defaultProps = {
    title: "",
    placeholder: "",
    className: "",
    value: null,
    onUpdate: null,
    onChange: null,
    onFormat: (row) => (row && row.id) ? row.nombre : '',
    columns: [
        { Header: 'Código', accessor: 'codigo', width: '25%' },
        { Header: 'Nombre', accessor: 'nombre', width: '70%' }
    ],
    disabled: false
};

export default InputStaticEntidad;
