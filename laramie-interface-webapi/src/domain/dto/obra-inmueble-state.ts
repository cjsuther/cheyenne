import ObraInmueble from "../entities/obra-inmueble";
import ObraInmuebleDetalleState from "./obra-inmueble-detalle-state";

export default class ObraInmuebleState extends ObraInmueble {

	state: string;
	obrasInmuebleDetalle: Array<ObraInmuebleDetalleState>;

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
		fechaVencidoMoratoria: Date = null,
		state: string = "o",
        obrasInmuebleDetalle: Array<ObraInmuebleDetalleState> = []
	)
	{
        super(id, idInmueble, idTasa, idSubTasa, idTipoMovimiento, numero, cuota, importe, fechaPrimerVencimiento, fechaSegundoVencimiento,
				idExpediente, detalleExpediente, idPersona, idTipoPersona, nombrePersona, idTipoDocumento, numeroDocumento,
				fechaPresentacion, fechaInspeccion, fechaAprobacion, fechaInicioDesglose, fechaFinDesglose, fechaFinObra,
				fechaArchivado, fechaIntimado, fechaVencidoIntimado, fechaMoratoria, fechaVencidoMoratoria);
		this.state = state;
		this.obrasInmuebleDetalle = obrasInmuebleDetalle;
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
		this.state = row.state ?? "o";
		this.obrasInmuebleDetalle = row.obrasInmuebleDetalle.map(x => {
            let item = new ObraInmuebleDetalleState();
            item.setFromObject(x);
            return item;
        });
	}

}
