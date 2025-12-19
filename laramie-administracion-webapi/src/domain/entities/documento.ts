export default class Documento {

    id: number;
	idTipoPersona: number;
	idPersona: number;
	idTipoDocumento: number;
	numeroDocumento: string;
	principal: boolean;

	constructor(
        id: number = 0,
		idTipoPersona: number = 0,
		idPersona: number = 0,
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		principal: boolean = false
	)
	{
        this.id = id;
		this.idTipoPersona = idTipoPersona;
		this.idPersona = idPersona;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.principal = principal;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.principal = row.principal ?? false;
	}

}
