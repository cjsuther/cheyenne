import React, { useState, useEffect } from 'react';
import { bool, string, number, func } from 'prop-types';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import ShowToastMessage from '../../../utils/toast';
import ListasModal from '../../controls/ListasModal';

import './index.css'


const InputLista = (props) => {

    const [state, setState] = useState({
        value: null,
        showList: false
    });

    useEffect(() => {
        setState(prevState => {
            return {...prevState, value: props.value };
        });
    }, [props.value]);

    const [getListLista, getRowLista] = useLista({
        listas: [props.lista],
        onLoaded: (listas, isSuccess, error) => {
            if (isSuccess) {
                setState(prevState => ({...prevState}));
            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        },
        memo: {
          key: props.lista,
          timeout: 0
        }
    });

    const onSelected = (id, row) => {
        if (props.onChange) {
            props.onChange({
                target: {
                    name: props.name,
                    type: 'lista',
                    value: id,
                    row: row
                }
            });
        }
        setState(prevState => {
            return {...prevState, showList: false};
        });
    }

    const format = (row) => (row && row.id) ? (props.showCode) ? `${row.codigo} - ${row.nombre}` : row.nombre : '';

    return (
        <div className='wrapper'>

            {props.showGrid && state.showList && (
                <ListasModal
                    title={props.title}
                    lista={props.lista}
                    onDismiss={() => {
                        setState(prevState => {
                            return {...prevState, showList: false};
                        });
                    }}
                    filter={props.filter}
                    onConfirm={onSelected}
                    showCode={props.showCode}
                />
            )}

            {(props.showGrid) ?
                <input
                    name={props.name}
                    type="text"
                    placeholder={props.placeholder}
                    className={`input-lista ${props.className}`}
                    value={format(getRowLista(props.lista, state.value))}
                    onClick={() => {
                        setState(prevState => {
                            return {...prevState, showList: true};
                        });
                    }}
                    readOnly={true}
                    disabled={props.disabled}
                />
            :
                <select
                    name={props.name}
                    placeholder={props.placeholder}
                    className={`input-lista ${props.className}`}
                    value={state.value??0}
                    onChange={({ target }) => {
                        if (props.onChange) {
                            props.onChange({
                                target: {
                                    name: props.name,
                                    type: 'lista',
                                    value: parseInt(target.value),
                                    row: getRowLista(props.lista, parseInt(target.value))
                                }
                            });
                        }
                    }}
                    disabled={props.disabled}
                >
                {props.withItemZero &&
                <option value={0}>{(props.disabled) ? '' : props.textItemZero}</option>
                }
                {getListLista(props.lista).filter(props.filter).map((item, index) =>
                <option value={item.id} key={index}>{format(item)}</option>
                )}
                </select>
            }

            {props.showGrid && !props.disabled && <span
                className="material-symbols-outlined icon-cruz"
                onClick={() => onSelected(0, null)}
            >close</span>}
        </div>
    )
}

InputLista.propTypes = {
    title: string,
    lista: string.isRequired,
    name: string.isRequired,
    placeholder: string,
    textItemZero: string,
    className: string,
    value: number,
    onChange: func,
    filter: func,
    showCode: bool,
    showGrid: bool,
    disabled: bool,
    withItemZero: bool
};

InputLista.defaultProps = {
    title: "",
    placeholder: "",
    textItemZero: "[Sin selección]",
    className: "",
    value: null,
    onChange: null,
    filter: (row) => { return true },
    showCode: false,
    showGrid: false,
    disabled: false,
    withItemZero: true
};

export default InputLista;
