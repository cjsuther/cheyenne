import { Loading } from '../../components/common';

import logo from '../../assets/images/LogoMunicipio.png';
import fondo from '../../assets/images/FondoMunicipio.jpg';
import { useForm } from '../../components/hooks/useForm';
import { useEffect, useState } from 'react';
import { ServerRequest } from '../../utils/apiweb';
import { useParams } from 'react-router-dom';
import { REQUEST_METHOD } from '../../consts/requestMethodType';
import { APPCONFIG } from '../../app.config';
import ShowToastMessage from '../../utils/toast';
import { ALERT_TYPE } from '../../consts/alertType';
import encrypt from '../../utils/encrypt';

const ChangePasswordView = () => {
    const params = useParams()

    const [formValues, formHandle] = useForm({ password: '', repeatPassword: '' })
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState(null)

    useEffect(() => {
        setLoading(true)
        
        const onInvalidToken = () => {
            setLoading(false)
            setToken(null)
        }

        const onSuccess = (res) => {
            res.json().then(data => setToken(data.token))
            setLoading(false)
        }

        const onNoSuccess = (response) => {
            response.json()
                .then((error) => {
                    const message = error.message;
                    ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                    onInvalidToken()
                })
                .catch((error) => {
                    const message = 'Error procesando respuesta: ' + error;
                    ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                    onInvalidToken()
                })
        }

        const onError = (error) => {
            const message = 'Error procesando solicitud: ' + error.message;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            onInvalidToken()
        }

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            false,
            APPCONFIG.SITE.WEBAPI + 'api/verificacion/token',
            `/${params.token}`,
            null,
            onSuccess,
            onNoSuccess,
            onError,
        )
    }, [])

    const onAccept = () => {
        if (formValues.password === '')
            return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar una contraseña')
        if (formValues.repeatPassword === '')
            return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe repetir la contraseña')
        if (formValues.password !== formValues.repeatPassword)
            return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Las contraseñas deben coincidir')
        
        const onSuccess = (res) => {
            res.json().then(data => {
                setToken(null)
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'La contraseña fue cambiada correctamente', () => {
                    window.location.href = APPCONFIG.SITE.WEBAPP + '/login'
                })
            })
        }

        const onNoSuccess = (response) => {
            response.json()
                .then((error) => {
                    const message = error.message;
                    ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                })
                .catch((error) => {
                    const message = 'Error procesando respuesta: ' + error;
                    ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                })
        }

        const onError = (error) => {
            const message = 'Error procesando solicitud: ' + error.message;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        }

        ServerRequest(
            REQUEST_METHOD.PUT, 
            null,
            false,
            APPCONFIG.SITE.WEBAPI + 'api/usuario/change-password',
            `/${token}`,
            { password: encrypt(formValues.password) },
            onSuccess,
            onNoSuccess,
            onError,
        )
    }

    return (
        <div>
            <div className='bg-img' style={{backgroundImage: `url("${fondo}")`}}>
            
                <Loading visible={loading}></Loading>
                    
                <div className="login-container">
                    <section className='lg-c'>

                        <img src={logo} alt="logo" className='navlogo logo-login'/>
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
                                disabled={loading || token === null}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="repeatPassword" className="form-label">Repetir Contraseña</label>
                            <input
                                name="repeatPassword"
                                type="password"
                                placeholder=""
                                className="form-control"
                                autoComplete="off"
                                value={ formValues.repeatPassword }
                                onChange={ formHandle }
                                disabled={loading || token === null}
                            />
                        </div>
                        <div className="mb-3">
                            <button className="btn btn-main" onClick={onAccept} disabled={loading || token === null}>
                                Cambiar Contraseña
                            </button>
                        </div>

                        <a href='#' onClick={() => window.location.href = APPCONFIG.SITE.WEBAPP + '/login'}>Volver</a>
                    </section>
                </div>

            </div>
        </div>
    )
}

export default ChangePasswordView