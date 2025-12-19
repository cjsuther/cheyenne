import React, { useState, useEffect } from 'react';
import { bool, string, func, any } from 'prop-types';
import DatePickerCustom from '../DatePickerCustom';
import { getFormatValueIn, getFormatValueOut } from '../../../utils/convert';
import InputNumber from '../InputNumber';
import InputLista from '../InputLista';
import InputEntidad from '../InputEntidad';

import './index.css'
import { GetTitleFromField } from '../../../utils/helpers';


const InputCustom = (props) => {


    const setValue = (value) => {
        if (props.type === "string") {
            if (props.value !== null) {
                return formatValueIn(value);
            }
            else {
                return "";
            }
        }
        else if (props.type === "date") {
            return formatValueIn(value);
        }
        else if (props.type === "number") {
            if (props.value !== null && props.value !== "") {
                return formatValueIn(value);
            }
            else {
                return 0;
            }
        }
        else if (props.type === "decimal") {
            if (props.value !== null && props.value !== "") {
                return formatValueIn(value);
            }
            else {
                return 0.00;
            }
        }
        else if (props.type === "boolean") {
            if (props.value !== null && props.value !== "") {
                return formatValueIn(value);
            }
            else {
                return false;
            }
        }
        else if (props.type === "any") {
            if (props.value !== null) {
                return formatValueIn(value);
            }
            else {
                return "";
            }
        }
        else if (props.type === "list") {
            return formatValueIn(value);
        }
        else if (props.type === "entity") {
            return formatValueIn(value);
        }
        else {
            return formatValueIn(value);
        }
    };


    function formatValueOut(value) {
        return getFormatValueOut(value, props.type, props.serialize);
    }

    function formatValueIn(value) {
        return getFormatValueIn(value, props.type, props.serialize);

    }


    return (
        <>

        {props.type === "string" &&
            <input
                name={props.name}
                type="text"
                placeholder={props.placeholder}
                className={`input-custom ${props.className}`}
                value={ setValue(props.value) }
                onChange={(event) => {
                    const target = {
                      name: event.target.name,
                      type: event.target.type,
                      value: formatValueOut(event.target.value)
                    }
                    props.onChange({target});
                }}
                maxLength={props.maxLength}
                disabled={props.disabled}
            />
        }
        {props.type === "date" &&
            <DatePickerCustom
                name={props.name}
                placeholder={props.placeholder}
                className="form-control"
                value={ setValue(props.value) }
                onChange={(event) => {
                    const target = {
                      name: event.target.name,
                      type: event.target.type,
                      value: formatValueOut(event.target.value)
                    }
                    props.onChange({target});
                }}
                disabled={props.disabled}
            />
        }
        {props.type === "number" &&
            <InputNumber
                name={props.name}
                placeholder={props.placeholder}
                className="form-control"
                precision={0}
                value={ setValue(props.value) }
                onChange={(event) => {
                    const target = {
                      name: event.target.name,
                      type: event.target.type,
                      value: formatValueOut(event.target.value)
                    }
                    props.onChange({target});
                }}
                disabled={props.disabled}
            />
        }
        {props.type === "decimal" &&
            <InputNumber
                name={props.name}
                placeholder={props.placeholder}
                className="form-control"
                precision={2}
                allowNegative={true}
                value={ setValue(props.value) }
                onChange={(event) => {
                    const target = {
                      name: event.target.name,
                      type: event.target.type,
                      value: formatValueOut(event.target.value)
                    }
                    props.onChange({target});
                }}
                disabled={props.disabled}
            />
        }
        {props.type === "boolean" &&
            <div className="p-top-5 p-left-5">
            <input
                name={props.name}
                type="checkbox"
                className={`form-check-input`}
                value=''
                checked={ setValue(props.value) }
                onChange={(event) => {
                    const target = {
                      name: event.target.name,
                      type: event.target.type,
                      checked: formatValueOut(event.target.checked)
                    }
                    props.onChange({target});
                }}
                disabled={props.disabled}
            />
            </div>
        }
        {props.type === "any" &&
            <input
                name={props.name}
                type="text"
                placeholder={props.placeholder}
                className={`input-custom ${props.className}`}
                value={ setValue(props.value) }
                onChange={(event) => {
                    const target = {
                      name: event.target.name,
                      type: event.target.type,
                      value: formatValueOut(event.target.value)
                    }
                    props.onChange({target});
                }}
                maxLength={props.maxLength}
                disabled={props.disabled}
            />
        }
        {props.type === "list" &&
            <InputLista
                name={props.name}
                placeholder={props.placeholder}
                className="form-control"
                value={ setValue(props.value) }
                onChange={(event) => {
                    const target = {
                      name: event.target.name,
                      type: event.target.type,
                      value: formatValueOut(event.target.value)
                    }
                    props.onChange({target});
                }}
                disabled={props.disabled}
                lista={props.name.substring(2)}
            />
        }
        {props.type === "entity" &&
            <InputEntidad
                name={props.name}
                placeholder={props.placeholder}
                className="form-control"
                value={ setValue(props.value) }
                onChange={(event) => {
                    const target = {
                      name: event.target.name,
                      type: event.target.type,
                      value: formatValueOut(event.target.value)
                    }
                    props.onChange({target});
                }}
                disabled={props.disabled}
                title={GetTitleFromField(props.name.substring(2))}
                entidad={props.name.substring(2)}
            />
        }

        </>
    )
}

InputCustom.propTypes = {
    name: string.isRequired,
    type: string.isRequired,
    placeholder: string,
    className: string,
    value: any,
    onChange: func,
    disabled: bool,
    serialize: bool,
    entidad: string,
    lista: string
};

InputCustom.defaultProps = {
    placeholder: "",
    className: "",
    value: null,
    onChange: null,
    disabled: false,
    serialize: false,
    entidad: "",
    lista: ""
};

export default InputCustom;
