import { useState } from 'react';


export const useForm = ( initialState = {}, prefix = "" ) => {
    
    const [values, setValues] = useState(initialState);
    const [hasPendingChanges, setHasPendingChanges] = useState(false);

    const reset = () => {
        setValues( initialState );
        setHasPendingChanges(false)
    }

    const set = (newState) => {
        setValues( newState );
        setHasPendingChanges(false)
    }

    const handleInputChange = ({ target }) => {

        setValues(prev => ({
            ...prev,
            [ target.name.replace(prefix, '') ]: 
                (target.type === 'checkbox') ? target.checked :
                (target.type === 'select-one') ? parseInt(target.value) :
                (target.type === 'date') ? target.value : //la conversion la hace DatePickerCustom
                target.value
        }))

        setHasPendingChanges(false)
    }

    return [ values, handleInputChange, reset, set, hasPendingChanges ];

}
