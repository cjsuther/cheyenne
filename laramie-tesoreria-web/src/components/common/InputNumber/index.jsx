import React from 'react';
import { bool, string, func, number } from 'prop-types';
import NumberFormat from 'react-number-format';

import './index.css'


const InputNumber = (props) => {

    return (
        <>

          <NumberFormat
              displayType={(props.disabled) ? 'text' : 'input'}
              className={`input-number ${props.className} ${props.disabled ? 'disabled' : ''}`}
              placeholder={props.placeholder}
              thousandSeparator={props.thousandSeparator}
              decimalSeparator={props.decimalSeparator}
              decimalScale={props.precision}
              fixedDecimalScale={(props.precision > 0)}
              defaultValue={0}
              // allowEmptyFormatting={true}
              value={props.value}
              isAllowed={(values) => props.validation(values.floatValue)}
              onValueChange={(values, sourceInfo) => {
                const { floatValue } = values;
                const { event } = sourceInfo;
                if (event) {
                  const target = {
                    name: props.name,
                    type: 'number',
                    value: floatValue
                  }
                  props.onChange({target});
                }
              }}
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
    isAllowed: func,
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
    validation: (value) => true,
    onChange: null,
    disabled: false
};

export default InputNumber;
