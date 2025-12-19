export default class Superficie {

    id: number;
	idInmueble: number;
	nroSuperficie: string;
	nroInterno: string;
	nroDeclaracionJurada: string;
	idTipoSuperficie: number;
	metros: string;
	plano: string;
	idGrupoSuperficie: number;
	idTipoObraSuperficie: number;
	idDestinoSuperficie: number;
	fechaIntimacion: Date;
	nroIntimacion: string;
	nroAnterior: string;
	fechaPresentacion: Date;
	fechaVigenteDesde: Date;
	fechaRegistrado: Date;
	fechaPermisoProvisorio: Date;
	fechaAprobacion: Date;
	conformeObra: boolean;
	fechaFinObra: Date;
	ratificacion: string;
	derechos: string;

	constructor(
        id: number = 0,
		idInmueble: number = 0,
		nroSuperficie: string = "",
		nroInterno: string = "",
		nroDeclaracionJurada: string = "",
		idTipoSuperficie: number = 0,
		metros: string = "",
		plano: string = "",
		idGrupoSuperficie: number = 0,
		idTipoObraSuperficie: number = 0,
		idDestinoSuperficie: number = 0,
		fechaIntimacion: Date = null,
		nroIntimacion: string = "",
		nroAnterior: string = "",
		fechaPresentacion: Date = null,
		fechaVigenteDesde: Date = null,
		fechaRegistrado: Date = null,
		fechaPermisoProvisorio: Date = null,
		fechaAprobacion: Date = null,
		conformeObra: boolean = false,
		fechaFinObra: Date = null,
		ratificacion: string = "",
		derechos: string = ""
	)
	{
        this.id = id;
		this.idInmueble = idInmueble;
		this.nroSuperficie = nroSuperficie;
		this.nroInterno = nroInterno;
		this.nroDeclaracionJurada = nroDeclaracionJurada;
		this.idTipoSuperficie = idTipoSuperficie;
		this.metros = metros;
		this.plano = plano;
		this.idGrupoSuperficie = idGrupoSuperficie;
		this.idTipoObraSuperficie = idTipoObraSuperficie;
		this.idDestinoSuperficie = idDestinoSuperficie;
		this.fechaIntimacion = fechaIntimacion;
		this.nroIntimacion = nroIntimacion;
		this.nroAnterior = nroAnterior;
		this.fechaPresentacion = fechaPresentacion;
		this.fechaVigenteDesde = fechaVigenteDesde;
		this.fechaRegistrado = fechaRegistrado;
		this.fechaPermisoProvisorio = fechaPermisoProvisorio;
		this.fechaAprobacion = fechaAprobacion;
		this.conformeObra = conformeObra;
		this.fechaFinObra = fechaFinObra;
		this.ratificacion = ratificacion;
		this.derechos = derechos;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idInmueble = row.idInmueble ?? 0;
		this.nroSuperficie = row.nroSuperficie ?? "";
		this.nroInterno = row.nroInterno ?? "";
		this.nroDeclaracionJurada = row.nroDeclaracionJurada ?? "";
		this.idTipoSuperficie = row.idTipoSuperficie ?? 0;
		this.metros = row.metros ?? "";
		this.plano = row.plano ?? "";
		this.idGrupoSuperficie = row.idGrupoSuperficie ?? 0;
		this.idTipoObraSuperficie = row.idTipoObraSuperficie ?? 0;
		this.idDestinoSuperficie = row.idDestinoSuperficie ?? 0;
		this.fechaIntimacion = row.fechaIntimacion ?? null;
		this.nroIntimacion = row.nroIntimacion ?? "";
		this.nroAnterior = row.nroAnterior ?? "";
		this.fechaPresentacion = row.fechaPresentacion ?? null;
		this.fechaVigenteDesde = row.fechaVigenteDesde ?? null;
		this.fechaRegistrado = row.fechaRegistrado ?? null;
		this.fechaPermisoProvisorio = row.fechaPermisoProvisorio ?? null;
		this.fechaAprobacion = row.fechaAprobacion ?? null;
		this.conformeObra = row.conformeObra ?? false;
		this.fechaFinObra = row.fechaFinObra ?? null;
		this.ratificacion = row.ratificacion ?? "";
		this.derechos = row.derechos ?? "";
	}

}