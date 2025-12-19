import { CONTEXT_ACTION_TYPE as type }  from '../../../consts/contextActionType';


export const sequenceReducer = ( state = { sequence: 1 }, action ) => {

    switch ( action.type ) {
        case type.SEQUENCE_RESET:
            return {
                value: 1
            }

        case type.SEQUENCE_NEXT:
            return {
                value: state.value + 1
            }
    
        default:
            return state;
    }

};
