export default class SubTasa {

    id: number;
	idTasa: number;
	codigo: string;
	descripcion: string;
	impuestoNacional: number;
	impuestoProvincial: number;
	ctasCtes: number;
	timbradosExtras: number;
	descripcionReducida: string;
	fechaDesde: Date;
	fechaHasta: Date;
	rubroGenerico: boolean;
	liquidableCtaCte: boolean;
	liquidableDDJJ: boolean;
	actualizacion: boolean;
	accesorios: boolean;
	internetDDJJ: boolean;
	imputXPorc: boolean;

	constructor(
        id: number = 0,
		idTasa: number = 0,
		codigo: string = "",
		descripcion: string = "",
		impuestoNacional: number = 0,
		impuestoProvincial: number = 0,
		ctasCtes: number = 0,
		timbradosExtras: number = 0,
		descripcionReducida: string = "",
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		rubroGenerico: boolean = false,
		liquidableCtaCte: boolean = false,
		liquidableDDJJ: boolean = false,
		actualizacion: boolean = false,
		accesorios: boolean = false,
		internetDDJJ: boolean = false,
		imputXPorc: boolean = false
	)
	{
        this.id = id;
		this.idTasa = idTasa;
		this.codigo = codigo;
		this.descripcion = descripcion;
		this.impuestoNacional = impuestoNacional;
		this.impuestoProvincial = impuestoProvincial;
		this.ctasCtes = ctasCtes;
		this.timbradosExtras = timbradosExtras;
		this.descripcionReducida = descripcionReducida;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
		this.rubroGenerico = rubroGenerico;
		this.liquidableCtaCte = liquidableCtaCte;
		this.liquidableDDJJ = liquidableDDJJ;
		this.actualizacion = actualizacion;
		this.accesorios = accesorios;
		this.internetDDJJ = internetDDJJ;
		this.imputXPorc = imputXPorc;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.codigo = row.codigo ?? "";
		this.descripcion = row.descripcion ?? "";
		this.impuestoNacional = row.impuestoNacional ?? 0;
		this.impuestoProvincial = row.impuestoProvincial ?? 0;
		this.ctasCtes = row.ctasCtes ?? 0;
		this.timbradosExtras = row.timbradosExtras ?? 0;
		this.descripcionReducida = row.descripcionReducida ?? "";
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.rubroGenerico = row.rubroGenerico ?? false;
		this.liquidableCtaCte = row.liquidableCtaCte ?? false;
		this.liquidableDDJJ = row.liquidableDDJJ ?? false;
		this.actualizacion = row.actualizacion ?? false;
		this.accesorios = row.accesorios ?? false;
		this.internetDDJJ = row.internetDDJJ ?? false;
		this.imputXPorc = row.imputXPorc ?? false;
	}

}
