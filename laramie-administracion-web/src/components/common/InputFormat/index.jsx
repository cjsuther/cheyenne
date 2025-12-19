import React from 'react';
import { bool, string, func, array, oneOfType } from 'prop-types';
import InputMask  from 'react-input-mask';


const InputFormat = (props) => {

    return (
        <>

          <InputMask 
              className={`input-format ${props.className}`}
              placeholder={props.placeholder}
              mask={props.mask}
              maskPlaceholder={props.maskPlaceholder}
              value={props.value}
              onChange={(event) => {
                const target = {
                  name: props.name,
                  type: 'text',
                  value: event.target.value
                }
                if (props.onChange) {
                  props.onChange({target});
                }
              }}
              onBlur={(event) => {
                const target = {
                  name: props.name,
                  type: 'text',
                  value: event.target.value
                }
                if (props.onBlur) {
                  props.onBlur({target});
                }
              }}
              disabled={props.disabled}
          />

        </>
    )
}

InputFormat.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    mask: array.isRequired,
    mask: oneOfType([string, array]).isRequired,
    value: string,
    onChange: func,
    onBlur: func,
    disabled: bool
};

InputFormat.defaultProps = {
    placeholder: "",
    className: "",
    mask: "",
    maskPlaceholder: null,
    value: "",
    onChange: null,
    onBlur: null,
    disabled: false
};

export default InputFormat;