import React from 'react';
import { bool, string, func, array, oneOfType } from 'prop-types';
import InputMask  from 'react-input-mask';


const InputFormat = (props) => {

    return (
        <>

          <InputMask 
              name={props.name}
              className={`input-format ${props.className}`}
              placeholder={props.placeholder}
              mask={props.mask}
              maskPlaceholder={props.maskPlaceholder}
              value={props.value}
              type={props.type}
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
              onKeyUp={props.onKeyUp}
              onKeyDown={props.onKeyDown}
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
    onKeyUp: func,
    onKeyDown: func,
    disabled: bool,
    type: string,
};

InputFormat.defaultProps = {
    placeholder: "",
    className: "",
    mask: "",
    maskPlaceholder: null,
    value: "",
    onChange: null,
    onBlur: null,
    onKeyUp: null,
    onKeyDown: null,
    disabled: false
};

export default InputFormat;