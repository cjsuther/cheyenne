
export default class Direccion {

    id: number;
    entidad: string;
    idEntidad: number;
    idTipoGeoreferencia: number;
    idPais: number;
    idProvincia: number;
    idLocalidad: number;
    idZonaGeoreferencia: number;
    codigoPostal: string;
    calle: string;
    entreCalle1: string;
    entreCalle2: string;
    altura: string;
    piso: string;
    dpto: string;
    referencia: string;
    longitud: number;
    latitud: number;
    

    constructor(
        id: number = 0,
        entidad: string = "",
        idEntidad: number = 0,
        idTipoGeoreferencia: number = 0,
        idPais: number = 0,
        idProvincia: number = 0,
        idLocalidad: number = 0,
        idZonaGeoreferencia: number = 0,
        codigoPostal: string = "",
        calle: string = "",
        entreCalle1: string = "",
        entreCalle2: string = "",
        altura: string = "",
        piso: string = "",
        dpto: string = "",
        referencia: string = "",
        longitud: number = 0,
        latitud: number = 0)
    {
        this.id = id;
        this.entidad = entidad;
        this.idEntidad = idEntidad;
        this.idTipoGeoreferencia = idTipoGeoreferencia;
        this.idPais = idPais;
        this.idProvincia = idProvincia;
        this.idLocalidad = idLocalidad;
        this.idZonaGeoreferencia = idZonaGeoreferencia;
        this.codigoPostal = codigoPostal;
        this.calle = calle;
        this.entreCalle1 = entreCalle1;
        this.entreCalle2 = entreCalle2;
        this.altura = altura;
        this.piso = piso;
        this.dpto = dpto;
        this.referencia = referencia;
        this.longitud = longitud;
        this.latitud = latitud;
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.entidad = row.entidad ?? "";
        this.idEntidad = row.idEntidad ?? 0;
        this.idTipoGeoreferencia = row.idTipoGeoreferencia ?? 0;
        this.idPais = row.idPais ?? 0;
        this.idProvincia = row.idProvincia ?? 0;
        this.idLocalidad = row.idLocalidad ?? 0;
        this.idZonaGeoreferencia = row.idZonaGeoreferencia ?? 0;
        this.codigoPostal = row.codigoPostal ?? "";
        this.calle = row.calle ?? "";
        this.entreCalle1 = row.entreCalle1 ?? "";
        this.entreCalle2 = row.entreCalle2 ?? "";
        this.altura = row.altura ?? "";
        this.piso = row.piso ?? "";
        this.dpto = row.dpto ?? "";
        this.referencia = row.referencia ?? "";
        this.longitud = row.longitud ?? 0;
        this.latitud = row.latitud ?? 0;
    }
    
}
