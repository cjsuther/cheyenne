import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { authActionLogin } from '../../context/redux/actions/authAction';
import { useForm } from '../../components/hooks/useForm';
import { Loading } from '../../components/common';
import ShowToastMessage from '../../utils/toast';

import logo from '../../assets/images/LogoMunicipio.png';
import fondo from '../../assets/images/FondoMunicipio.jpg';


function LoginView() {

    const [state, setState] = useState({
        loading: false
    });

    const [ formValues, formHandle ] = useForm({
        username: '',
        password: ''
    });

    const dispatch = useDispatch();

    const handleClick = () => {
        if (isFormValid()) {
            Login();
        }
    }

    const isFormValid = () => {
        if (formValues.username.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Usuario incorrecto');
            return false;
        }
        else if (formValues.password.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Password incorrecto');
            return false;
        }
        else {
            return true;
        }
    }

    const Login = () => {

        setState(prevState => {
            return {...prevState, loading: true, error: ''};
        });

        const callbackSuccess = (response) => {
            response.text()
            .then((token) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                dispatch( authActionLogin(formValues.username, token) );
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            });
        };
        const callbackNoSuccess = (response) => {
            const message = 'Error de servidor: ' + response.statusText;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        };
        const callbackError = (error) => {
            const message = 'Error de conexión: ' + error.message;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        };

        const dataBody = {
            "username": formValues.username,
            "password": formValues.password
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            false,
            APIS.URLS.LOGIN,
            null,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    };


    return (
    <div>
        <div className='bg-img' style={{backgroundImage: `url("${fondo}")`}}>
        
            <Loading visible={state.loading}></Loading>
                
            <div className="login-container">
                <section className='lg-c'>

                    <img src={logo} alt="logo" className='navlogo logo-login'/>

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Usuario</label>
                        <input
                            name="username"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.username }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            placeholder=""
                            className="form-control"
                            autoComplete="off"
                            value={ formValues.password }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-main" onClick={ handleClick }>Ingresar</button>
                    </div>

                </section>
            </div>

        </div>
    </div>
    )
}

export default LoginView;
