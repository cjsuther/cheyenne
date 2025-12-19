export default class Persona {

    id: number;
	idTipoPersona: number;
	nombrePersona: string;
	idTipoDocumento: number;
	numeroDocumento: string;

	constructor(
        id: number = 0,
		idTipoPersona: number = 0,
		nombrePersona: string = "",
		idTipoDocumento: number = 0,
		numeroDocumento: string = ""
	)
	{
        this.id = id;
		this.idTipoPersona = idTipoPersona;
		this.nombrePersona = nombrePersona;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.nombrePersona = row.nombrePersona ?? "";
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
	}

}
