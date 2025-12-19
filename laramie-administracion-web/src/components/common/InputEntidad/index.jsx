import React, { useState, useEffect, useCallback } from 'react';
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

    const [, getRowEntidad, readyEntidad] = useEntidad({
        entidades: [props.entidad],
        onLoaded: (entidades, isSuccess, error) => {
            if (isSuccess) {
                setState(prevState => ({...prevState}));
            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        },
        memo: {
          key: props.entidad,
          timeout: 0
        }
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
                    row: getRowEntidad(props.entidad, props.value)
                }
            });
        }
    }, [props.value, readyEntidad]);

    
    return (
        <>

            {state.showList && (
                <EntidadesModal
                    title={props.title}
                    entidad={props.entidad}
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
                    filter={props.filter}
                    columns={props.columns}
                />
            )}

            <input
                name={props.name}
                type="text"
                placeholder={props.placeholder}
                className={`input-entidad ${props.className}`}
                value={props.onFormat(getRowEntidad(props.entidad, state.value) ?? '')}
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
    disabled: bool
};

InputEntidad.defaultProps = {
    title: "",
    placeholder: "",
    className: "",
    value: null,
    onUpdate: null,
    onChange: null,
    onFormat: (row) => (row && row.id) ? row.nombre : '',
    filter: (row) => { return true },
    columns: [
        { Header: 'Código', accessor: 'codigo', width: '25%' },
        { Header: 'Nombre', accessor: 'nombre', width: '70%' }
    ],
    disabled: false
};

export default InputEntidad;
