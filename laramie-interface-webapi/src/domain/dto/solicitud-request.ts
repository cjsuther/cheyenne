import SolicitudDataRequest from "./solicitud-data-request";

export default class SolicitudRequest {
    version: string;
    timestamp: string;
    correlationId: string;
    parameters: SolicitudDataRequest;

    constructor(
        version: string = "",
        timestamp: string = "",
        correlationId: string = "",
        parameters: SolicitudDataRequest = null
    ) {
        this.version = version;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
        this.parameters = parameters;
    }

    setFromObject = (row) =>
    {
        this.version = row.version ?? "";
        this.timestamp = row.timestamp ?? "";
        this.correlationId = row.correlationId ?? "";
        this.parameters = new SolicitudDataRequest();
        this.parameters.setFromObject(row.parameters);
    }
    
}
