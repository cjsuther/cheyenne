import { CONTEXT_ACTION_TYPE as type } from '../../../consts/contextActionType';

export const memoActionSet = (key, value, timeout) => ({
    type: type.MEMO_SET,
    payload: {
        key,
        value,
        timeout
    }
});

export const memoActionDel = (key) => ({
    type: type.MEMO_DEL,
    payload: {
        key
    }
});

export const memoActionDelAll = (key) => ({
    type: type.MEMO_DEL_ALL,
    payload: {}
});


