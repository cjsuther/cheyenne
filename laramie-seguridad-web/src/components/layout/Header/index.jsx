import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PublicRoutes } from '../../../routes/public';
import { PrivateRoutes } from '../../../routes/private';
import { authActionlogout } from '../../../context/redux/actions/authAction';
import { memoActionDelAll } from '../../../context/redux/actions/memoAction';
import { dataTaggerActionClearAll } from '../../../context/redux/actions/dataTaggerAction';
import { sequenceActionReset } from '../../../context/redux/actions/sequenceAction';
import { CloneObject, DistinctArray } from '../../../utils/helpers';
import { useAccess } from '../../hooks/useAccess';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { APPCONFIG } from '../../../app.config';

import { NavBarCompact, NavBarHorizontal } from './components'

import './index.scss';

const MIN_WINDOW_SIZE = 900

function Header() {

    const dispatch = useDispatch();

    const [publicRoutes, setPublicRoutes] = useState([]);
    const [privateRoutes, setPrivateRoutes] = useState([]);

    let tempPrivateRoutes = [];
        
    const [ObtainedPrivateRoute, ready] = useAccess({
        key: '_SecurityAccesses',
        onLoaded: (data, isSuccess, error) => {
            if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        }
    });

    useEffect(() => {
        if (ready) {
            let AuxRoutes = ObtainedPrivateRoute.map(route => ({
                code: route.codigo,
                module:  route.modulo
            }));

            // Búsqueda de coincidencia por código de permiso.
            PrivateRoutes.filter(route => AuxRoutes.some(auxRoute => auxRoute.code === route.code)).forEach(route => tempPrivateRoutes.push(route));
                        
            // Inclusión de agrupadores según los códigos incluidos arriba.
            const groups = PrivateRoutes.filter(route => tempPrivateRoutes.some(r => route.children.find(c => c === r.index)));
            DistinctArray(groups.map(group => group.index)).forEach(index => {
                tempPrivateRoutes.push(PrivateRoutes.find(f => f.index === index));
            });

            tempPrivateRoutes.sort((a,b) => a.index - b.index);
            setPublicRoutes(PublicRoutes.filter(f => f.nivelMenu > 0).map(x => {
                return { index: x.index, title: x.title, path: x.path, nivelMenu: x.nivelMenu, children: x.children, selected: false };
            }));
            setPrivateRoutes(tempPrivateRoutes.filter(f => f.nivelMenu > 0).map(x => {
                return { index: x.index, title: x.title, path: x.path, nivelMenu: x.nivelMenu, children: x.children, selected: false };
            }));
        }
    }, [ready]);

    const {isAuthenticated, username} = useSelector( (state) => state.auth );

    const handleClickMenu = (index) => {
        let routes = Object.values(CloneObject(privateRoutes));
        routes.forEach((route, i) => {
            if (index && route.index === index) {
                route.selected = !route.selected;
            }
            else {
                route.selected = false;
            }
        });
        setPrivateRoutes(routes);
    }

    const handleClickHome = () => {
        window.location=APPCONFIG.SITE.WEBAPP_PRINCIPAL + 'welcome';
    }

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

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleWindowResize = () => {
            setScreenWidth(window.innerWidth)
        }
        window.addEventListener("resize", handleWindowResize)
        
        return () => {
            window.removeEventListener("resize", handleWindowResize)
        }
    }, [])

    const navBarProps = { isAuthenticated, username, publicRoutes, privateRoutes, handleClickHome, handleClickMenu, handleClickLogout }

    return (
        <nav className="navbar navbar-expand-sm p-top-15">
            {screenWidth > MIN_WINDOW_SIZE ? (
                <NavBarHorizontal {...navBarProps} />
            ) : (
                <NavBarCompact {...navBarProps} />
            )}
        </nav>
    )
}

export default Header;