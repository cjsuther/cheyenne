import Superficie from "../entities/superficie";

export default class SuperficieState extends Superficie {

    state: string;

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
		derechos: string = "",
		state: string = "o"
	)
	{
        super(id, idInmueble, nroSuperficie, nroInterno, nroDeclaracionJurada, idTipoSuperficie, metros, plano, idGrupoSuperficie, idTipoObraSuperficie, idDestinoSuperficie, fechaIntimacion, nroIntimacion, nroAnterior, fechaPresentacion, fechaVigenteDesde, fechaRegistrado, fechaPermisoProvisorio, fechaAprobacion, conformeObra, fechaFinObra, ratificacion, derechos);		
		this.state = state;
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
		this.state = row.state ?? "o";
	}

}