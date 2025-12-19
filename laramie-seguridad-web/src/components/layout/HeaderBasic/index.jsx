import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { authActionlogout } from '../../../context/redux/actions/authAction';
import { memoActionDelAll } from '../../../context/redux/actions/memoAction';
import { dataTaggerActionClearAll } from '../../../context/redux/actions/dataTaggerAction';
import { sequenceActionReset } from '../../../context/redux/actions/sequenceAction';
import { ServerRequest } from '../../../utils/apiweb';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';

import logo from '../../../assets/images/LogoMunicipio.png';

import './index.css';


function HeaderBasic() {

    const dispatch = useDispatch();

    const {isAuthenticated, username} = useSelector( (state) => state.auth );

    const handleClickLogout = () => {
        const callbackSuccess = () => {
            dispatch( memoActionDelAll() );
            dispatch( dataTaggerActionClearAll() );
            dispatch( sequenceActionReset() );
            dispatch( authActionlogout() );
        };

        const path = '/expirate';

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.SESION,
            path,
            null,
            callbackSuccess,
            callbackSuccess,
            callbackSuccess
        );
    }

    return (

        <nav className="navbar navbar-expand-sm p-top-15">

            <img src={logo} alt="logo" className='navlogo'/>

            <div className="collapse navbar-collapse">

            </div>

            <div className='collapse navbar-collapse login-nav'>
                {isAuthenticated && (
                    <>
                        <div className="navbar-nav">
                            <div className="nav-item nav-link-login p-right-5"><i className='fa fa-user'></i></div>
                        </div>
                        <div className="navbar-nav">
                            <div className="nav-item nav-link-login p-right-20">{username}</div>
                        </div>
                        <div className="navbar-nav">
                            <div className="nav-item nav-link-login p-right-5"><i className='fas fa-sign-out-alt'></i></div>
                        </div>
                        <div className="navbar-nav">
                            <div onClick={ handleClickLogout } className="nav-item nav-link p-right-10">Logout</div>
                        </div>
                    </>
                )}
            </div>
    
        </nav>

    )
}

export default HeaderBasic;