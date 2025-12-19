import React, { useState, useEffect } from 'react';
import { bool, string, func, number } from 'prop-types';
import { OnKeyPress_validInteger } from '../../../utils/validator';

import './index.css'


const InputCodigo = (props) => {

const [state, setState] = useState({
    value: ""
});

useEffect(() => {
    setState(prevState => {
        return {...prevState, value: props.value };
    });
}, [props.value]);

    return (
      
      <input
          name={props.name}
          type="text"
          placeholder={props.placeholder}
          className={`input-codigo ${props.className}`}
          value={ state.value }
          onChange={ props.onChange }
          onKeyPress={ OnKeyPress_validInteger }
          onKeyDown={props.onKeyDown}
          maxLength={props.maxLength}
          disabled={props.disabled}
      />

    )
}

InputCodigo.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: string,
    maxLength: number,
    onChange: func,
    onKeyDown: func,
    disabled: bool
};

InputCodigo.defaultProps = {
    placeholder: "",
    className: "",
    value: "",
    maxLength: 250,
    onChange: null,
    onKeyDown: null,
    disabled: false
};

export default InputCodigo;
