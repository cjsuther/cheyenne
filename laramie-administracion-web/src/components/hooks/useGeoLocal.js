import { useState, useEffect } from 'react';

export const useGeoLocal = ( initialState = {
    country: '',
    state: '',
    city: '',
    town: '',
    street: ''
}) => {
    
    const [address, setAddress] = useState(initialState);
    const [location, setLocation] = useState({lat: 0, lng: 0, status: 0, message: '', timestamp: 0});

    useEffect(() => {
        process();
    }, [address]);

    const process = () => {
        if (address.country.trim().length > 0 && address.state.trim().length > 0 && address.city.trim().length > 0 &&
            address.street.trim().length > 0 && address.number.trim().length > 0) {
            //realizar proceso de georeferencia con address
            const number = parseInt(address.number.trim());
            if (number === 0) {
                const lat = -34.69940213932803;
                const lng = -58.39291513880464;
                setLocation({lat: lat, lng: lng, status: 1, message: '', timestamp: Date.now()});
            }
            else {
                setLocation({lat: 0, lng: 0, status: 2, message: 'LNS: No se obtuvo resultados', timestamp: Date.now()});
            }
        }
        // else {
        //     setLocation({lat: location.lat, lng: location.lng, status: 3, message: 'LNS: Existen campos incompletos'});
        // }
    }

    return [ location, setAddress ];

}
