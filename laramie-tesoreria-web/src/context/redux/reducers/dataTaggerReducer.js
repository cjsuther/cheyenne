import { CONTEXT_ACTION_TYPE as type }  from '../../../consts/contextActionType';

export const dataTaggerReducer = ( state = { data: {} }, action ) => {

    switch ( action.type ) {
        case type.DATA_TAGGER_CLEAR:
            if ('data' in state && state.data[action.payload.processKey]) {
                delete state.data[action.payload.processKey];
            }
            return {
                data: {...state.data}
            };

        case type.DATA_TAGGER_CLEAR_ALL:
            if (state.data) {
                state.data = {};
            }
            return {
                data: {...state.data}
            };

        case type.DATA_TAGGER_SET:
            if ('data' in state) {
                state.data[action.payload.processKey] = action.payload.data;
            }
            else {
                state = {
                    data: {
                        [action.payload.processKey]: action.payload.data
                    }
                };
            }
            return {
                data: {...state.data}
            };

        case type.DATA_TAGGER_ADD:
            state.data[action.payload.processKey][action.payload.dataTaggerType].push(action.payload.row);
            return {
                data: {...state.data}
            };

        case type.DATA_TAGGER_MODIFY:
            const index = state.data[action.payload.processKey][action.payload.dataTaggerType].indexOf(
                state.data[action.payload.processKey][action.payload.dataTaggerType].find(x => x.id === action.payload.row.id)
            );
            if (index !== -1) {
                state.data[action.payload.processKey][action.payload.dataTaggerType][index] = action.payload.row;
            }
            return {
                data: {...state.data}
            };

        case type.DATA_TAGGER_REMOVE:
            state.data[action.payload.processKey][action.payload.dataTaggerType] = 
            state.data[action.payload.processKey][action.payload.dataTaggerType].filter(f =>
                !(f.entidad === action.payload.row.entidad && f.id === action.payload.row.id)
            );
            return {
                data: {...state.data}
            };
    
        default:
            return state;
    }

};
