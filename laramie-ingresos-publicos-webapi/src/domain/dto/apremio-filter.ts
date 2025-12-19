export default class ApremioFilter {

	numero: string;
	caratula: string;
	idExpediente: number;
	idOrganismoJudicial: number;
	fechaInicioDemandaDesde: Date;
	fechaInicioDemandaHasta: Date;

	constructor(
		numero: string = "",
		caratula: string = "",
		idExpediente: number = 0,
		idOrganismoJudicial: number = 0,
		fechaInicioDemandaDesde: Date = null,
		fechaInicioDemandaHasta: Date = null,
	)
	{
		this.numero = numero;
		this.caratula = caratula;
		this.idExpediente = idExpediente;
		this.idOrganismoJudicial = idOrganismoJudicial;
		this.fechaInicioDemandaDesde = fechaInicioDemandaDesde;
		this.fechaInicioDemandaHasta = fechaInicioDemandaHasta;
	}

	setFromObject = (row) =>
	{
		this.numero = row.numero ?? "";
		this.caratula = row.caratula ?? "";
		this.idExpediente = row.idExpediente ?? 0;
		this.idOrganismoJudicial = row.idOrganismoJudicial ?? 0;
		this.fechaInicioDemandaDesde = row.fechaInicioDemandaDesde ?? null;
		this.fechaInicioDemandaHasta = row.fechaInicioDemandaHasta ?? null;
	}

}
