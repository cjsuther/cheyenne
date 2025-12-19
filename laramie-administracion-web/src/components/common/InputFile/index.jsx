import React, { useState, useEffect, useRef } from 'react';
import { bool, string, func } from 'prop-types';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';

import './index.css'


const InputFile = (props) => {

    const [state, setState] = useState({
        value: ''
    });

    const refInputFile = useRef(null);

    useEffect(() => {
      setState(prevState => {
        return {...prevState,
          value: props.value
        };
      });
    }, [props.value]);

    //handles
    const handleInputFileChange = (event) => {
      if (event.target.files.length === 0) {
        event.preventDefault();
        return;
      }

      let file = event.target.files[0];
      let reader = new FileReader();

      reader.onload = (e) => {
        if (props.onUpload) {
            props.onUpload(file.name, e.target.result);
        }
      }
      reader.onerror = (error) => {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
      
      reader.readAsArrayBuffer(file);
      event.target.value = "";
    }

    return (
        <>

            <input
                type="text"
                placeholder={props.placeholder}
                className={`input-file ${props.className}`}
                value={state.value}
                onClick={() => {
                  refInputFile.current.click();
                }}
                readOnly={true}
                disabled={props.disabled}
            />

            <input
                ref={refInputFile}
                type="file"
                multiple={false}
                hidden
                onChange={handleInputFileChange}
            />

        </>
    )
}

InputFile.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: string,
    onChange: func,
    onUpload: func,
    disabled: bool
};

InputFile.defaultProps = {
    placeholder: "",
    className: "",
    value: "",
    onChange: null,
    onUpload: null,
    disabled: false
};

export default InputFile;
