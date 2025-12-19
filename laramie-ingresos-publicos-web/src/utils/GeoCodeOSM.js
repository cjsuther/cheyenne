export function GeoCode_OSM() {

    let GeoCode_OSM_status = 0; //0: init - 1: success - 2: no data - 3: error
    let GeoCode_OSM_message = '';
    let GeoCode_OSM_lat = 0;
    let GeoCode_OSM_lng = 0;
    let GeoCode_OSM_callbackDone = null;
    let GeoCode_Street = '';


    function Load() {

    }

    function ConsultarCodeAddress(calle, numero, barrio, ciudad, provincia, pais, callbackDone) {
        GeoCode_OSM_message = '';
        GeoCode_OSM_status = false;
        GeoCode_OSM_lat = 0;
        GeoCode_OSM_lat = 0;
        GeoCode_OSM_callbackDone = callbackDone;
        GeoCode_Street = '';

        let params = 'street=' + numero + ' ' + calle;
        params += barrio.length > 0 ? '&town=' + barrio : '';
        params += ciudad.length > 0 ? '&city=' + ciudad : '';
        params += '&state=' + provincia;
        params += '&country=' + pais;

        try {
            const geocodeurl = 'https://nominatim.openstreetmap.org/search?' + params + '&format=json';
            const geocodeurlEncoded = encodeURI(geocodeurl);

            fetch(geocodeurlEncoded)
            .then((response) => {
                if (response.ok) {
                    response.json()
                    .then((data) => {
                        let addressResult = null;
                        if (data !== null && data.length > 0) {
                            const display_name_part = data[0].display_name.split(',');
                            if (!isNaN(display_name_part[0])) {
                                addressResult = data[0];
                            }
                            GeoCode_Street = display_name_part[1].slice(1)

                        }

                        if (addressResult) {
                            GeoCode_OSM_status = 1;
                            GeoCode_OSM_lat = parseFloat(addressResult.lat);
                            GeoCode_OSM_lng = parseFloat(addressResult.lon);
                        }
                        else {
                            GeoCode_OSM_status = 2;
                            GeoCode_OSM_message = 'OSM: No se obtuvo resultados';
                        }

                        GeoCode_OSM_callbackDone(GetResponse());
                    })
                    .catch((error) => {
                        GeoCode_OSM_status = 3;
                        GeoCode_OSM_message = 'OSM: No se pudo procesar los datos (Error: ' + error + ')';
                        GeoCode_OSM_callbackDone(GetResponse());
                    });
                }
                else {
                    GeoCode_OSM_status = 3;
                    GeoCode_OSM_message = 'OSM: No se pudo procesar la respuesta';
                    GeoCode_OSM_callbackDone(GetResponse());
                }
            })
            .catch((error) => {
                GeoCode_OSM_status = 3;
                GeoCode_OSM_message = 'OSM: No se pudo procesar la solicitud (Error: ' + error + ')';
                GeoCode_OSM_callbackDone(GetResponse());
            });

        } catch (error) {
            GeoCode_OSM_status = 3;
            GeoCode_OSM_message = 'OSM: Error general (Error: ' + error + ')';
            GeoCode_OSM_callbackDone(GetResponse());
        }
    }

    function GetResponse() {
        return {
            lat: GeoCode_OSM_lat,
            lng: GeoCode_OSM_lng,
            status: GeoCode_OSM_status,
            message: GeoCode_OSM_message,
            timestamp: Date.now(),
            street: GeoCode_Street,
        };
    }


    return {
        Load: Load,
        ConsultarCodeAddress: ConsultarCodeAddress,
        GetResponse: GetResponse
    };

}
