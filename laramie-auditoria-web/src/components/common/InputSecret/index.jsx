import { useState } from 'react'
import InputFormat from '../InputFormat'

import './index.scss'

const InputSecret = ({ title, name, value, onChange, onPressEnter, maxLength, disabled, autoComplete, mask, maskPlaceholder }) => {
    const [hidden, setHidden] = useState(true)

    return (
        <>
            <label htmlFor={name} className="form-label">{title}</label>
            <div className="input-secret-container">
                <input
                    className='form-control'
                    readOnly
                    aria-hidden
                    tabIndex={-1}
                    disabled={disabled}
                />
                <div className='input-secret-sub-container'>
                    <InputFormat
                        {...{name, value, onChange, maxLength, disabled, autoComplete, mask, maskPlaceholder}}
                        type={hidden ? "password" : "text"}
                        placeholder=""
                        className="form-control input-secret-text"
                        onKeyUp={({ key }) => { if (key === 'Enter') onPressEnter?.() }}
                    />
                    <div className='input-secret-icon-container' onClick={() => setHidden(x => !x)}>
                        <span className="material-symbols-outlined input-secret-icon" title="Ver">
                            {hidden ? 'visibility_off' : 'visibility'}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InputSecret
