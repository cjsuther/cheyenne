import React from 'react'
import { APPCONFIG } from '../../../app.config';
import RedirectExternalUrl from '../RedirectExternalUrl'


export default function PublicRoute(props) {
  return (
    (!props.isAuthenticated)
    ? ( props.component )
    : ( <RedirectExternalUrl location={ APPCONFIG.SITE.WEBAPP_PRINCIPAL + 'logout' }></RedirectExternalUrl> )
  )
}
