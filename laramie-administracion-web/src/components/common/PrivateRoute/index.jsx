import React from 'react'
import { APPCONFIG } from '../../../app.config';
import RedirectExternalUrl from '../RedirectExternalUrl'

export default function PrivateRoute(props) {
  return (
    (props.isAuthenticated)
    ? ( props.component )
    : ( <RedirectExternalUrl location={ APPCONFIG.SITE.WEBAPP_PRINCIPAL + 'logout' }></RedirectExternalUrl> )
  )
}
