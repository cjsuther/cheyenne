export default class Inspeccion {

    id: number;
	idComercio: number;
	numero: string;
	idMotivoInspeccion: number;
	idSupervisor: number;
	idInspector: number;
	fechaInicio: Date;
	fechaFinalizacion: Date;
	fechaNotificacion: Date;
	fechaBaja: Date;
	anioDesde: string;
	mesDesde: string;
	anioHasta: string;
	mesHasta: string;
	numeroResolucion: string;
	letraResolucion: string;
	anioResolucion: string;
	fechaResolucion: Date;
	numeroLegajillo: string;
	letraLegajillo: string;
	anioLegajillo: string;
	activo: string;
	porcentajeMulta: number;
	emiteConstancia: string;
	pagaPorcentaje: boolean;
	idExpediente: number;

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
		idExpediente: number = 0
	)
	{
        this.id = id;
		this.idComercio = idComercio;
		this.numero = numero;
		this.idMotivoInspeccion = idMotivoInspeccion;
		this.idSupervisor = idSupervisor;
		this.idInspector = idInspector;
		this.fechaInicio = fechaInicio;
		this.fechaFinalizacion = fechaFinalizacion;
		this.fechaNotificacion = fechaNotificacion;
		this.fechaBaja = fechaBaja;
		this.anioDesde = anioDesde;
		this.mesDesde = mesDesde;
		this.anioHasta = anioHasta;
		this.mesHasta = mesHasta;
		this.numeroResolucion = numeroResolucion;
		this.letraResolucion = letraResolucion;
		this.anioResolucion = anioResolucion;
		this.fechaResolucion = fechaResolucion;
		this.numeroLegajillo = numeroLegajillo;
		this.letraLegajillo = letraLegajillo;
		this.anioLegajillo = anioLegajillo;
		this.activo = activo;
		this.porcentajeMulta = porcentajeMulta;
		this.emiteConstancia = emiteConstancia;
		this.pagaPorcentaje = pagaPorcentaje;
		this.idExpediente = idExpediente;
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
	}

}
