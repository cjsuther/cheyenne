import React from 'react';
import { useSelector } from 'react-redux';

import LocalStorage from '../../context/storage/localStorage';
import { APPCONFIG } from '../../app.config';
import administracion from '../../assets/images/Administracion_icon.svg';
import ing_publicos from '../../assets/images/IngresosPublicos_icon.svg';
import seguridad from '../../assets/images/Seguridad_icon.svg';
import HeaderBasic from '../../components/layout/HeaderBasic';

import './index.scss';


function WelcomeView() {

    const token = LocalStorage.get("accessToken");
    const {username} = useSelector( (state) => state.auth );

    const handleClickAdministracion = () => {
        const url = APPCONFIG.WEBAPP.ADMINISTRACION + `?username=${username}&token=${token}`;
        window.location.href = url;
    }

    const handleClickIngresosPublicos = () => {
        const url = APPCONFIG.WEBAPP.INGRESOS_PUBLICOS + `?username=${username}&token=${token}`;
        window.location.href = url;
    }

    const handleClickSeguridad = () => {
        const url = APPCONFIG.WEBAPP.SEGURIDAD + `?username=${username}&token=${token}`;
        window.location.href = url;
    }

    return (
    <>  
        <HeaderBasic showMenu={false} />

        <div>
            <div className='bg-img ingreso-bg_container'>
                <div className="login-container">
                    <section className='ingreso_container'>

                        <div className="mb-3">
                            <div onClick={ handleClickAdministracion } className="nav-link">
                                <img src={administracion} alt="administracion" className='ingreso-icon'/>
                                <span className='ingreso-text'>ADMINISTRACIÓN</span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div onClick={ handleClickIngresosPublicos } className="nav-link">
                                <img src={ing_publicos} alt="ingresos-publicos" className='ingreso-icon'/>
                                <span className='ingreso-text'>INGRESOS PÚBLICOS</span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div onClick={ handleClickSeguridad } className="nav-link">
                                <img src={seguridad} alt="seguridad" className='ingreso-icon'/>
                                <span className='ingreso-text'>SEGURIDAD</span>
                            </div>
                        </div>

                    </section>
                </div>
            </div>
        </div>
    </>
    )
    
}

export default WelcomeView;