import React, { useState, useEffect } from 'react';
import { bool, string, func } from 'prop-types';
import { OnKeyPress_validInteger } from '../../../utils/validator';

import './index.css'


const InputEjercicio = (props) => {

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
          type="number"
          placeholder={props.placeholder}
          className={`input-ejercicio ${props.className}`}
          value={ state.value }
          onChange={ props.onChange }
          onKeyPress={ OnKeyPress_validInteger }
          maxLength="4"
          max={props.max}
          disabled={props.disabled}
      />

    )
}

InputEjercicio.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: string,
    value: string,
    onChange: func,
    disabled: bool
};

InputEjercicio.defaultProps = {
    placeholder: "",
    className: "",
    value: "",
    value: "",
    onChange: null,
    disabled: false
};

export default InputEjercicio;
