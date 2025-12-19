import { CONTEXT_ACTION_TYPE as type } from '../../../consts/contextActionType';

export const authActionLogin = (username, token) => ({
    type: type.AUTH_LOGIN,
    payload: {
        username,
        token
    }
});

export const authActionlogout = () => ({
    type: type.AUTH_LOGOUT,
    payload: {
        
    }
});


