import React, { useState, useEffect } from 'react';
import { bool, string, func, number } from 'prop-types';
import NumberFormat from 'react-number-format';

import './index.scss'


const InputNumber = (props) => {

    const [value, setValue] = useState(props.value);

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    const handleFocus = () => {
        if (value === 0 || value === '0') {
            setValue('');
        }
    };

    const handleBlur = () => {
        if (value === '' || value === null || value === undefined) {
            setValue(0);
            if (props.onChange) {
                const target = {
                    name: props.name,
                    type: 'number',
                    value: 0,
                };
                props.onChange({ target });
            }
        }
    };

    const handleValueChange = (values, sourceInfo) => {
        const { floatValue } = values;
        setValue(floatValue ?? '');
        if (props.onChange && sourceInfo.event) {
            const target = {
                name: props.name,
                type: 'number',
                value: floatValue ?? '',
            };
            props.onChange({ target });
        }
    };

    return (
        <>
            <NumberFormat
                name={props.name}
                displayType={props.disabled ? 'text' : 'input'}
                className={`input-number ${props.className} ${
                    props.disabled ? 'disabled' : ''
                }`}
                placeholder={props.placeholder}
                thousandSeparator={props.thousandSeparator}
                decimalSeparator={props.decimalSeparator}
                decimalScale={props.precision}
                fixedDecimalScale={props.precision > 0}
                allowNegative={props.allowNegative}
                value={value}
                isAllowed={(values) => props.validation(values.floatValue)}
                onValueChange={handleValueChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </>
    )
}

InputNumber.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: number,
    thousandSeparator: string,
    decimalSeparator: string,
    precision: number,
    allowNegative: bool,
    validation: func,
    onChange: func,
    disabled: bool
};

InputNumber.defaultProps = {
    placeholder: "",
    className: "",
    value: 0,
    thousandSeparator: ".",
    decimalSeparator: ",",
    precision: 0,
    allowNegative: false,
    validation: (value) => true,
    onChange: null,
    disabled: false
};

export default InputNumber;
