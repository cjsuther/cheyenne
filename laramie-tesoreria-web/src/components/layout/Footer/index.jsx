
import React from 'react';
import logo from '../../../assets/images/LogoLaramie.png';

import './index.css';
import Tip from "../../common/Tip";

function Footer(props) {
    return (
        <footer className="footer">
            <div className="container-fluid-footer p-left-50">
                <img src={logo} alt="logo" height={16}/>
                <div className="footer-icons p-right-50">
                    <span className="m-right-5">Versión 1.0</span>
                    {props.tipName &&
                    <Tip name={props.tipName} position="top" />
                    }
                </div>
            </div>
        </footer>
    )
}

export default Footer;