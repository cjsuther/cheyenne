import React from 'react';
import { useEffect } from 'react';

function RedirectExternalUrl(props) {

    useEffect(() => {
        if (props.location){
            var location = props.location
            if (!location.startsWith("http")){
                location = `https://${location}`
            }

            window.location = location
        }
    }, []);

    return (
        <></>
    )
}

export default RedirectExternalUrl;