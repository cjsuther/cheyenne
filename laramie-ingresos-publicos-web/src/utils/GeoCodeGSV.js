
import Geocode from "react-geocode";

export function GeoCode_GSV() {

    let GeoCode_GSV_status = 0; //0: init - 1: success - 2: no data - 3: error
    let GeoCode_GSV_message = '';
    let GeoCode_GSV_lat = 0;
    let GeoCode_GSV_lng = 0;
    let GeoCode_GSV_callbackDone = null;

    Geocode.setApiKey("AIzaSyAwUDQ4ns-rVzvjtuFl_FkPXZmg48ScMaM");
    Geocode.setLanguage("en");
    Geocode.setRegion("es");
    Geocode.setLocationType("ROOFTOP");
    Geocode.enableDebug();

    function Load() {

    }

    function ConsultarCodeAddress(calle, numero, barrio, ciudad, provincia, pais, callbackDone) {
        GeoCode_GSV_message = '';
        GeoCode_GSV_status = false;
        GeoCode_GSV_lat = 0;
        GeoCode_GSV_lat = 0;
        GeoCode_GSV_callbackDone = callbackDone;

        let params = calle + " "  + numero;
        params += barrio.length > 0 ? ' ' + barrio : '';
        params += ciudad.length > 0 ? ' ' + ciudad : '';
        params += ", " + provincia + ", " + pais;

        try {

            Geocode.fromAddress(params).then(
                ({status, results}) => {

                    if (status === 'OK') {
    
                        let addressResult = null;
                        results.forEach((item, index) => {
                            let partial_match = (item.partial_match !== undefined && item.partial_match);
                            let has_street_number = false;
                            for (let c=0; c<item.address_components.length; c++) {
                                if (item.address_components[c].types[0] === "street_number") {
                                    has_street_number = true;
                                    break;
                                }
                            }
                            //valido la certeza de la busqueda
                            if (!partial_match && has_street_number && item.geometry.location_type !== 'APPROXIMATE') {
                                addressResult = item;
                                return false;
                            }
                        });
    
                        if (addressResult) {
                            GeoCode_GSV_status = 1;
                            GeoCode_GSV_lat = addressResult.geometry.location.lat;
                            GeoCode_GSV_lng = addressResult.geometry.location.lng;
                        }
                        else {
                            GeoCode_GSV_status = 2;
                            GeoCode_GSV_message = 'GSV: No se obtuvo resultados';
                        }
    
                    }
                    else {
                        GeoCode_GSV_status = 3;
                        GeoCode_GSV_message = 'GSV: No se pudo procesar la respuesta (Error: ' + status + ')';
                    }
            
                    GeoCode_GSV_callbackDone(GetResponse());

                },
                (error) => {
                    GeoCode_GSV_status = 3;
                    GeoCode_GSV_message = 'GSV: No se pudo procesar la solicitud (Error: ' + error + ')';
                    GeoCode_GSV_callbackDone(GetResponse());
                }
              );

        }
        catch (error) {
            GeoCode_GSV_status = 3;
            GeoCode_GSV_message = 'GSV: Error general (Error: ' + error + ')';
            GeoCode_GSV_callbackDone(GetResponse());
        }
    }

    function GetResponse() {
        return {
            lat: GeoCode_GSV_lat,
            lng: GeoCode_GSV_lng,
            status: GeoCode_GSV_status,
            message: GeoCode_GSV_message,
            timestamp: Date.now()
        };
    }


    return {
        Load: Load,
        ConsultarCodeAddress: ConsultarCodeAddress,
        GetResponse: GetResponse
    };

}
