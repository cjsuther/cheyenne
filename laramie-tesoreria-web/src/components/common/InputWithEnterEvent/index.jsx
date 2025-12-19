import React from 'react';
import { InputFormat } from  '../';

const InputWithEnterEvent = ({ useInputFormat=false, onEnter, ...props }) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onEnter();
        }
    };

    if (useInputFormat) {
        return <InputFormat {...props} onKeyDown={handleKeyDown} />;
    } else {
        return <input {...props} onKeyDown={handleKeyDown} />;
    }
};

export default InputWithEnterEvent;