import Inspeccion from "../entities/inspeccion";

export default class InspeccionState extends Inspeccion {

    state: string;

	constructor(
        id: number = 0,
		idComercio: number = 0,
		numero: string = "",
		idMotivoInspeccion: number = 0,
		idSupervisor: number = 0,
		idInspector: number = 0,
		fechaInicio: Date = null,
		fechaFinalizacion: Date = null,
		fechaNotificacion: Date = null,
		fechaBaja: Date = null,
		anioDesde: string = "",
		mesDesde: string = "",
		anioHasta: string = "",
		mesHasta: string = "",
		numeroResolucion: string = "",
		letraResolucion: string = "",
		anioResolucion: string = "",
		fechaResolucion: Date = null,
		numeroLegajillo: string = "",
		letraLegajillo: string = "",
		anioLegajillo: string = "",
		activo: string = "",
		porcentajeMulta: number = 0,
		emiteConstancia: string = "",
		pagaPorcentaje: boolean = false,
		idExpediente: number = 0,
		state: string = "o"
	)
	{
        super(id, idComercio, numero, idMotivoInspeccion, idSupervisor, idInspector, fechaInicio, 
			fechaFinalizacion, fechaNotificacion, fechaBaja, anioDesde, mesDesde, anioHasta, mesHasta, 
			numeroResolucion, letraResolucion, anioResolucion, fechaResolucion, numeroLegajillo, letraLegajillo,
			anioLegajillo, activo, porcentajeMulta, emiteConstancia, pagaPorcentaje, idExpediente
			);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idComercio = row.idComercio ?? 0;
		this.numero = row.numero ?? "";
		this.idMotivoInspeccion = row.idMotivoInspeccion ?? 0;
		this.idSupervisor = row.idSupervisor ?? 0;
		this.idInspector = row.idInspector ?? 0;
		this.fechaInicio = row.fechaInicio ?? null;
		this.fechaFinalizacion = row.fechaFinalizacion ?? null;
		this.fechaNotificacion = row.fechaNotificacion ?? null;
		this.fechaBaja = row.fechaBaja ?? null;
		this.anioDesde = row.anioDesde ?? "";
		this.mesDesde = row.mesDesde ?? "";
		this.anioHasta = row.anioHasta ?? "";
		this.mesHasta = row.mesHasta ?? "";
		this.numeroResolucion = row.numeroResolucion ?? "";
		this.letraResolucion = row.letraResolucion ?? "";
		this.anioResolucion = row.anioResolucion ?? "";
		this.fechaResolucion = row.fechaResolucion ?? null;
		this.numeroLegajillo = row.numeroLegajillo ?? "";
		this.letraLegajillo = row.letraLegajillo ?? "";
		this.anioLegajillo = row.anioLegajillo ?? "";
		this.activo = row.activo ?? "";
		this.porcentajeMulta = row.porcentajeMulta ?? 0;
		this.emiteConstancia = row.emiteConstancia ?? "";
		this.pagaPorcentaje = row.pagaPorcentaje ?? false;
		this.idExpediente = row.idExpediente ?? 0;
		this.state = row.state ?? "o";
	}

}
