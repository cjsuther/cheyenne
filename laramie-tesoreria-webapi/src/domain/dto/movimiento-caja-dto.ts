import MovimientoCaja from "../entities/movimiento-caja";
import MovimientoMedioPago from "../entities/movimiento-medio-pago";
import ReciboPublicacion from "../entities/recibo-publicacion";

export default class MovimientoCajaDto extends MovimientoCaja {

	mediosPagos: MovimientoMedioPago[];
    recibos: ReciboPublicacion[];

	constructor(
        id: number = 0,
		idCaja: number = 0,
		idCajaAsignacion: number = 0,
		idTipoMovimientoCaja: number = 0,
		importeCobro: number = 0,
		fechaCobro: Date = null,
		observacion: string = "",
		mediosPagos: MovimientoMedioPago[] = [],
		recibos: ReciboPublicacion[] = []
	)
	{
        super(id, idCaja, idCajaAsignacion, idTipoMovimientoCaja, importeCobro, fechaCobro, observacion);
		this.mediosPagos = mediosPagos;
		this.recibos = recibos;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCaja = row.idCaja ?? 0;
		this.idCajaAsignacion = row.idCajaAsignacion ?? 0;
		this.idTipoMovimientoCaja = row.idTipoMovimientoCaja ?? 0;
		this.importeCobro = row.importeCobro ?? 0;
		this.fechaCobro = row.fechaCobro ?? null;
		this.observacion = row.observacion ?? "";
		this.mediosPagos = row.mediosPagos ?? [];
		this.recibos = row.recibos ?? [];
	}

}
