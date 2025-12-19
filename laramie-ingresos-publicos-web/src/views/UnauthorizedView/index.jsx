import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { authActionlogout } from '../../context/redux/actions/authAction';
import { memoActionDelAll } from '../../context/redux/actions/memoAction';
import { dataTaggerActionClearAll } from '../../context/redux/actions/dataTaggerAction';
import { sequenceActionReset } from '../../context/redux/actions/sequenceAction';
import timeout from '../../assets/images/timeout.png';


function UnauthorizedView() {

    const mount = () => {

        setTimeout(() => {
            dispatch( memoActionDelAll() );
            dispatch( dataTaggerActionClearAll() );
            dispatch( sequenceActionReset() );
            dispatch( authActionlogout() );
        }, 4000);

        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const dispatch = useDispatch();


    return (
        <section className='m-top-50 text-center'>

            <h2>Su sesión ha expirado</h2>
            <h3>Te estamos redirigiendo a la página de autenticación...</h3>

            <div className="m-top-100">
                <img src={timeout} alt="logo" width={250} height={250} />
            </div>

        </section>
    )
}

export default UnauthorizedView;
