import React from 'react';
import logo from '../../../assets/images/LogoLaramie.png';

import './index.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="container-fluid-footer p-left-50">
                <img src={logo} alt="logo" height={16}/>
                <div className="footer-icons p-right-50">
                    <span className="material-symbols-outlined ms-help m-right-5">help</span>
                    <span>Versión 1.0</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer;