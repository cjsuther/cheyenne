import { useState, useEffect } from 'react';
import { GeoCode_OSM } from '../../utils/GeoCodeOSM';

export const useGeoOSM = ( initialState = {
    country: '',
    state: '',
    city: '',
    town: '',
    street: '',
    number: ''
}) => {

    const geocoder = GeoCode_OSM();
    
    const [address, setAddress] = useState(initialState);
    const [location, setLocation] = useState({lat: 0, lng: 0, status: 0, message: '', timestamp: 0});

    useEffect(() => {
        process();
    }, [address]);

    const process = () => {
        if (address.country.trim().length > 0 && address.state.trim().length > 0 && address.city.trim().length > 0 &&
            address.street.trim().length > 0 && address.number.trim().length > 0) {

            geocoder.Load();
            geocoder.ConsultarCodeAddress(address.street, address.number, address.town, address.city, address.state, address.country,
            (response) => {
                if (response.status === 1) {
                    setLocation(response);
                }
                else {
                    setLocation(prevLocation => {
                        return {...prevLocation, status: response.status, message: response.message};
                    });
                }
            });
        }
        // else {
        //     setLocation({lat: location.lat, lng: location.lng, status: 3, message: 'OSM: Existen campos incompletos'});
        // }
    }

    return [ location, setAddress ];

}
