import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authActionlogout } from '../../context/redux/actions/authAction';
import { APPCONFIG } from '../../app.config';


function LogoutView(props) {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch( authActionlogout() );
        // window.location = APPCONFIG.SITE.WEBAPP_PRINCIPAL + 'login';
    }, []);

    return (
        <></>
    )
}

export default LogoutView;
