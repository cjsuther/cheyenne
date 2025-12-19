import MovimientoMedioPago from "../entities/movimiento-medio-pago";

export default class MovimientoCobranzaDto {

	observacion: string;
    mediosPagos: MovimientoMedioPago[];
    recibos: number[];

    constructor(
        observacion: string = "",
        mediosPagos: MovimientoMedioPago[] = [],
        recibos: number[] = [])
    {
        this.observacion = observacion;
        this.mediosPagos = mediosPagos;
        this.recibos = recibos;
    }

    setFromObject = (row) =>
    {
        this.observacion = row.observacion ?? "";
        this.mediosPagos = row.mediosPagos ?? [];
        this.recibos = row.recibos ?? [];
    }

    
}
