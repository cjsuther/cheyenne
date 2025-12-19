export default class ObraInmueble {

    id: number;
	idInmueble: number;
	idTasa: number;
	idSubTasa: number;
	idTipoMovimiento: number;
	numero: string;
	cuota: number;
	importe: number;
	fechaPrimerVencimiento: Date;
	fechaSegundoVencimiento: Date;
	idExpediente: number;
	detalleExpediente: string;
	idPersona: number;
	idTipoPersona: number;
	nombrePersona: string;
	idTipoDocumento: number;
	numeroDocumento: string;
	fechaPresentacion: Date;
	fechaInspeccion: Date;
	fechaAprobacion: Date;
	fechaInicioDesglose: Date;
	fechaFinDesglose: Date;
	fechaFinObra: Date;
	fechaArchivado: Date;
	fechaIntimado: Date;
	fechaVencidoIntimado: Date;
	fechaMoratoria: Date;
	fechaVencidoMoratoria: Date;

	constructor(
        id: number = 0,
		idInmueble: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		idTipoMovimiento: number = 0,
		numero: string = "",
		cuota: number = 0,
		importe: number = 0,
		fechaPrimerVencimiento: Date = null,
		fechaSegundoVencimiento: Date = null,
		idExpediente: number = 0,
		detalleExpediente: string = "",
		idPersona: number = 0,
		idTipoPersona: number = 0,
		nombrePersona: string = "",
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		fechaPresentacion: Date = null,
		fechaInspeccion: Date = null,
		fechaAprobacion: Date = null,
		fechaInicioDesglose: Date = null,
		fechaFinDesglose: Date = null,
		fechaFinObra: Date = null,
		fechaArchivado: Date = null,
		fechaIntimado: Date = null,
		fechaVencidoIntimado: Date = null,
		fechaMoratoria: Date = null,
		fechaVencidoMoratoria: Date = null
	)
	{
        this.id = id;
		this.idInmueble = idInmueble;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.idTipoMovimiento = idTipoMovimiento;
		this.numero = numero;
		this.cuota = cuota;
		this.importe = importe;
		this.fechaPrimerVencimiento = fechaPrimerVencimiento;
		this.fechaSegundoVencimiento = fechaSegundoVencimiento;
		this.idExpediente = idExpediente;
		this.detalleExpediente = detalleExpediente;
		this.idPersona = idPersona;
		this.idTipoPersona = idTipoPersona;
		this.nombrePersona = nombrePersona;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.fechaPresentacion = fechaPresentacion;
		this.fechaInspeccion = fechaInspeccion;
		this.fechaAprobacion = fechaAprobacion;
		this.fechaInicioDesglose = fechaInicioDesglose;
		this.fechaFinDesglose = fechaFinDesglose;
		this.fechaFinObra = fechaFinObra;
		this.fechaArchivado = fechaArchivado;
		this.fechaIntimado = fechaIntimado;
		this.fechaVencidoIntimado = fechaVencidoIntimado;
		this.fechaMoratoria = fechaMoratoria;
		this.fechaVencidoMoratoria = fechaVencidoMoratoria;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idInmueble = row.idInmueble ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.idTipoMovimiento = row.idTipoMovimiento ?? 0;
		this.numero = row.numero ?? "";
		this.cuota = row.cuota ?? 0;
		this.importe = row.importe ?? 0;
		this.fechaPrimerVencimiento = row.fechaPrimerVencimiento ?? null;
		this.fechaSegundoVencimiento = row.fechaSegundoVencimiento ?? null;
		this.idExpediente = row.idExpediente ?? 0;
		this.detalleExpediente = row.detalleExpediente ?? "";
		this.idPersona = row.idPersona ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.nombrePersona = row.nombrePersona ?? "";
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.fechaPresentacion = row.fechaPresentacion ?? null;
		this.fechaInspeccion = row.fechaInspeccion ?? null;
		this.fechaAprobacion = row.fechaAprobacion ?? null;
		this.fechaInicioDesglose = row.fechaInicioDesglose ?? null;
		this.fechaFinDesglose = row.fechaFinDesglose ?? null;
		this.fechaFinObra = row.fechaFinObra ?? null;
		this.fechaArchivado = row.fechaArchivado ?? null;
		this.fechaIntimado = row.fechaIntimado ?? null;
		this.fechaVencidoIntimado = row.fechaVencidoIntimado ?? null;
		this.fechaMoratoria = row.fechaMoratoria ?? null;
		this.fechaVencidoMoratoria = row.fechaVencidoMoratoria ?? null;
	}

}
