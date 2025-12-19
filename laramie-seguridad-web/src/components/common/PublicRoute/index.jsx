import React from 'react'
import { APPCONFIG } from '../../../app.config';
import RedirectExternalUrl from '../RedirectExternalUrl'
import {
  useLocation,
  Navigate
} from "react-router-dom";

export default function PublicRoute(props) {

  const location = useLocation();

  if (location.pathname.endsWith('logout')) {
    return (
      (props.isAuthenticated)
      ? ( props.component )
      //: ( <RedirectExternalUrl location={ APPCONFIG.SITE.WEBAPP_PRINCIPAL + 'login' }></RedirectExternalUrl> )
      : ( <Navigate replace to="/login" />)
    )
  }
  else {
    return (
      (!props.isAuthenticated)
      ? ( props.component )
      //: ( <RedirectExternalUrl location={ APPCONFIG.SITE.WEBAPP_PRINCIPAL + 'welcome' }></RedirectExternalUrl> )
      : ( <Navigate replace to="/welcome" />)
    )
  }
}