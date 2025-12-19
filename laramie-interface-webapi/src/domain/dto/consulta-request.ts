import ConsultaDataRequest from "./consulta-data-request";

export default class ConsultaRequest {
    version: string;
    timestamp: string;
    correlationId: string;
    parameters: ConsultaDataRequest;

    constructor(
        version: string = "",
        timestamp: string = "",
        correlationId: string = "",
        parameters: ConsultaDataRequest = null
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
        this.parameters = new ConsultaDataRequest();
        this.parameters.setFromObject(row.parameters);
    }
    
}
