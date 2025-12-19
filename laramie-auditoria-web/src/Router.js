import React , {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Routes,
  Route,
  useSearchParams,
  useLocation
} from "react-router-dom";

import { PublicRoutes } from './routes/public';
import { PrivateRoutes } from './routes/private';
import { authActionLogin } from './context/redux/actions/authAction';
import { memoActionDelAll } from './context/redux/actions/memoAction';
import { dataTaggerActionClearAll } from './context/redux/actions/dataTaggerAction';
import { sequenceActionReset } from './context/redux/actions/sequenceAction';
import PublicRoute from './components/common/PublicRoute';
import PrivateRoute from './components/common/PrivateRoute';
import Master from './components/layout/Master';
import { useAccess } from './components/hooks/useAccess';
import ShowToastMessage from './utils/toast';
import { ALERT_TYPE } from './consts/alertType';
import { DistinctArray } from './utils/helpers';

function Router() {

    const dispatch = useDispatch();
    const isAuthenticated = useSelector( (state) => state.auth.isAuthenticated );
    
    const location = useLocation();
    const [queryParams, setQueryParams] = useSearchParams();
    const token = queryParams.get('token');

    let forceAuthentication = false;
    if (token) {
        const username = queryParams.get('username');
        queryParams.delete('token');
        queryParams.delete('username');
        setQueryParams(queryParams);
        dispatch( memoActionDelAll() );
        dispatch( dataTaggerActionClearAll() );
        dispatch( sequenceActionReset() );
        dispatch( authActionLogin(username, token) );
        forceAuthentication = true;
    }

    const [FilteredPrivateRoutes, setFilteredPrivateRoutes] = useState([
        PrivateRoutes.find(route => route.code === 'home'),
        PrivateRoutes.find(route => route.code === 'unauthorized')
    ]);

    let tempPrivateRoutes = [];
        
    const [ObtainedPrivateRoute, ready] = useAccess({
        key: (location.pathname.endsWith('unauthorized')) ? '' : '_SecurityAccesses',
        onLoaded: (data, isSuccess, error) => {
            if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        }
    });

    useEffect(() => {
        if (ready) {
            const AuxRoutes = ObtainedPrivateRoute.map(route => ({
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

            setFilteredPrivateRoutes(prevState => {
                const NotFoundRoute = PrivateRoutes.find(route => route.code === 'not-found');
                return [...prevState, NotFoundRoute, ...tempPrivateRoutes];
            });
        }
    }, [ready]);
    
    if (forceAuthentication) {
        setTimeout(() => {
            window.location.href = `${window.location.origin}${window.location.pathname}`
        }, 500);
        return <></>;
    }

  return (
    <Routes>
    {
        PublicRoutes.map((route, indexr) => (
            Array.isArray(route.path) ?
                route.path.map((path, indexp) => (
                    <Route key={`${indexr}-${indexp}`}
                        path={path}
                        element={
                            <PublicRoute
                                isAuthenticated={isAuthenticated}
                                component={<Master showHeader={route.showHeader} component={route.component} />}
                            />
                        }
                    />
                ))
            :
                <Route key={indexr}
                path={route.path}
                element={
                    <PublicRoute
                        isAuthenticated={isAuthenticated}
                        component={<Master showHeader={route.showHeader} component={route.component} />}
                    />
                }
        />
        ))
    }
    {
        FilteredPrivateRoutes.map((route, indexr) => (
            Array.isArray(route.path) ?
                route.path.map((path, indexp) => (
                    <Route key={`${indexr}-${indexp}`}
                        path={path}
                        element={
                            <PrivateRoute
                                isAuthenticated={isAuthenticated}
                                component={<Master showHeader={route.showHeader} component={route.component} properties={route.properties} />}
                            />
                        }
                    />
                ))
            :
                <Route key={indexr}
                path={route.path}
                element={
                    <PrivateRoute
                        isAuthenticated={isAuthenticated}
                        component={<Master showHeader={route.showHeader} component={route.component} properties={route.properties} />}
                    />
                }
        />
        ))
    }
    </Routes>
  );
}

export default Router;
