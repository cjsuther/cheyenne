import React, { useState, useEffect, useRef, useMemo } from 'react';
import { object, bool, func } from 'prop-types';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { APPCONFIG } from '../../../app.config';
import MapsMarker from '../../common/MapsMarker';

import 'leaflet/dist/leaflet.css'


const Maps = (props) => {

    const locationInit = {
        lat: APPCONFIG.MAPS.LAT,
        lng: APPCONFIG.MAPS.LNG
    }

    const mapRef = useRef(null);

    const [disabled, setDisabled] = useState(true);
    const [position, setPosition] = useState(locationInit);

    useEffect(() => {
        setPosition(props.position);
    }, [props.position]);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView([position.lat, position.lng], mapRef.current.getZoom(), true);
        }
    }, [position]);

    useEffect(() => {
        setDisabled(props.disabled);
    }, [props.disabled]);

    return (
        <MapContainer
            ref={mapRef}
            center={[position.lat, position.lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '400px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapsMarker
                draggable={!disabled}
                position={position}
                onChange={(newPosition) => {
                    setPosition(newPosition);
                    if (props.onChange) {
                        props.onChange(newPosition);
                    }
                }}
            />
        </MapContainer>
    )
  }

  Maps.propTypes = {
    disabled: bool,
    position: object.isRequired,
    onChange: func
  };
  
  Maps.defaultProps = {
    disabled: true,
    onChange: null
  };
  
  export default Maps