import { CONTEXT_ACTION_TYPE as type } from '../../../consts/contextActionType';

export const dataTaggerActionClear = (processKey,data) => ({
    type: type.DATA_TAGGER_CLEAR,
    payload: {
        processKey
    }
});

export const dataTaggerActionClearAll = (processKey) => ({
    type: type.DATA_TAGGER_CLEAR_ALL,
    payload: {}
});

export const dataTaggerActionSet = (processKey,data) => ({
    type: type.DATA_TAGGER_SET,
    payload: {
        processKey,
        data
    }
});

export const dataTaggerActionAdd = (processKey,dataTaggerType, row) => ({
    type: type.DATA_TAGGER_ADD,
    payload: {
        processKey,
        dataTaggerType,
        row
    }
});

export const dataTaggerActionModify = (processKey,dataTaggerType, row) => ({
    type: type.DATA_TAGGER_MODIFY,
    payload: {
        processKey,
        dataTaggerType,
        row
    }
});

export const dataTaggerActionRemove = (processKey,dataTaggerType, row) => ({
    type: type.DATA_TAGGER_REMOVE,
    payload: {
        processKey,
        dataTaggerType,
        row
    }
});
