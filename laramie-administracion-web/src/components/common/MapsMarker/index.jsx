import React, { useState, useEffect, useRef, useMemo } from 'react';
import { object, bool, string, func } from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import { APPCONFIG } from '../../../app.config';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css'
import MarkerIcon from 'leaflet/dist/images/marker-icon-2x.png';


const MapsMarker = (props) => {

    const locationInit = {
        lat: APPCONFIG.MAPS.LAT,
        lng: APPCONFIG.MAPS.LNG
    }

    const markerRef = useRef(null);

    const [draggable, setDraggable] = useState(false);
    const [position, setPosition] = useState(locationInit);

    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker) {
            const newPosition = marker.getLatLng();
            setPosition(newPosition);
            if (props.onChange) {
                props.onChange(newPosition);
            }
          }
        },
      }),
      [],
    )

    useEffect(() => {
        setPosition(props.position);
    }, [props.position]);

    useEffect(() => {
        setDraggable(props.draggable);
    }, [props.draggable]);


    const markerIconConst = L.icon({
        iconUrl: MarkerIcon,
        iconRetinaUrl: MarkerIcon,
        iconAnchor: [5, 55],
        popupAnchor: [10, -44],
        iconSize: [25, 40],
    });

  
    return (
        <Marker
            ref={markerRef}
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={position}
            icon={markerIconConst}
        >
            {(props.popup) && (
                <Popup>{props.popup}</Popup>
            )}
        </Marker>
    )
  }

  MapsMarker.propTypes = {
    dragable: bool,
    position: object.isRequired,
    popup: string,
    onChange: func
  };
  
  MapsMarker.defaultProps = {
    dragable: false,
    popup: null,
    onChange: null
  };
  
  export default MapsMarker