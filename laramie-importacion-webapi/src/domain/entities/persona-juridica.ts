export default class PersonaJuridica {

    id: number;
	idTipoDocumento: number;
	numeroDocumento: string;
	denominacion: string;
	nombreFantasia: string;
	idFormaJuridica: number;
	idJurisdiccion: number;
	fechaConstitucion: Date;
	mesCierre: number;
	logo: string;

	constructor(
        id: number = 0,
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		denominacion: string = "",
		nombreFantasia: string = "",
		idFormaJuridica: number = 0,
		idJurisdiccion: number = 0,
		fechaConstitucion: Date = null,
		mesCierre: number = 0,
		logo: string = ""
	)
	{
        this.id = id;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.denominacion = denominacion;
		this.nombreFantasia = nombreFantasia;
		this.idFormaJuridica = idFormaJuridica;
		this.idJurisdiccion = idJurisdiccion;
		this.fechaConstitucion = fechaConstitucion;
		this.mesCierre = mesCierre;
		this.logo = logo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.denominacion = row.denominacion ?? "";
		this.nombreFantasia = row.nombreFantasia ?? "";
		this.idFormaJuridica = row.idFormaJuridica ?? 0;
		this.idJurisdiccion = row.idJurisdiccion ?? 0;
		this.fechaConstitucion = row.fechaConstitucion ?? null;
		this.mesCierre = row.mesCierre ?? 0;
		this.logo = row.logo ?? "";
	}

}
