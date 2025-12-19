export default class Contribuyente {

    id: number;
	idPersona: number;
	idTipoPersona: number;
	idTipoDocumento: number;
	numeroDocumento: string;
	nombrePersona: string;
	fechaAlta: Date;

	constructor(
        id: number = 0,
		idPersona: number = 0,
		idTipoPersona: number = 0,
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		nombrePersona: string = "",
		fechaAlta: Date = null
	)
	{
        this.id = id;
		this.idPersona = idPersona;
		this.idTipoPersona = idTipoPersona;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.nombrePersona = nombrePersona;
		this.fechaAlta = fechaAlta;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.nombrePersona = row.nombrePersona ?? "";
		this.fechaAlta = row.fechaAlta ?? null;
	}

}
