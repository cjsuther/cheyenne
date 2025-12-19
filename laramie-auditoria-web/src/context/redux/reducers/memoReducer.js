import { APPCONFIG } from '../../../app.config';
import { CONTEXT_ACTION_TYPE as type }  from '../../../consts/contextActionType';


export const memoReducer = ( state = { cache: {} }, action ) => {

    const today = new Date();

    switch ( action.type ) {
        case type.MEMO_SET:
            const timeout = (action.payload.timeout === 0) ? (today.getTime() + parseInt(APPCONFIG.GENERAL.REDUX_TIMEOUT_DEFAULT) * 1000) :
                            (action.payload.timeout > 0) ? (today.getTime() + parseInt(action.payload.timeout) * 1000) : -1;

            if ('cache' in state) {
                state.cache[action.payload.key] = {
                    value: action.payload.value,
                    timeout: timeout
                }
            }
            else {
                state = {
                    cache: {
                        [action.payload.key]: {
                            value: action.payload.value,
                            timeout: timeout
                        }
                    }
                };
            }
            return {
                cache: {...state.cache}
            };

        case type.MEMO_DEL:
            if ('cache' in state && state.cache[action.payload.key]) {
                delete state.cache[action.payload.key];
            }
            return {
                cache: {...state.cache}
            };

        case type.MEMO_DEL_ALL:
            if (state.cache) {
                state.cache = {};
            }
            return {
                cache: {...state.cache}
            };
    
        default:
            return state;
    }

};
