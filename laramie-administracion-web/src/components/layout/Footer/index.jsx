import React from 'react';
import logo from '../../../assets/images/LogoMajorLaramie.svg';

import './index.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="container-fluid p-left-50">
                <img src={logo} alt="logo" height={30}/>
            </div>
        </footer>
    )
}

export default Footer;