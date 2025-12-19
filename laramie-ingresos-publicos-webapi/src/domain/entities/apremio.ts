export default class Apremio {

    id: number;
	numero: string;
	idExpediente: number;
	idOrganismoJudicial: number;
	fechaInicioDemanda: Date;
	carpeta: string;
	caratula: string;
	estado: string;

	constructor(
        id: number = 0,
		numero: string = "",
		idExpediente: number = 0,
		idOrganismoJudicial: number = 0,
		fechaInicioDemanda: Date = null,
		carpeta: string = "",
		caratula: string = "",
		estado: string = ""
	)
	{
        this.id = id;
		this.numero = numero;
		this.idExpediente = idExpediente;
		this.idOrganismoJudicial = idOrganismoJudicial;
		this.fechaInicioDemanda = fechaInicioDemanda;
		this.carpeta = carpeta;
		this.caratula = caratula;
		this.estado = estado;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.numero = row.numero ?? "";
		this.idExpediente = row.idExpediente ?? 0;
		this.idOrganismoJudicial = row.idOrganismoJudicial ?? 0;
		this.fechaInicioDemanda = row.fechaInicioDemanda ?? null;
		this.carpeta = row.carpeta ?? "";
		this.caratula = row.caratula ?? "";
		this.estado = row.estado ?? "";
	}

}
