export default class PlanPagoDefinicionFilter {

	idEstadoPlanPagoDefinicion: number;
	idTipoPlanPago: number;
	idTipoTributo: number;
	idTasaPlanPago: number;
	idSubTasaPlanPago: number;
	descripcion: string;
	fechaDesde: Date;
	fechaHasta: Date;
    etiqueta: string;

	constructor(
		idEstadoPlanPagoDefinicion: number = 0,
		idTipoPlanPago: number = 0,
		idTipoTributo: number = 0,
		idTasaPlanPago: number = 0,
		idSubTasaPlanPago: number = 0,
		descripcion: string = "",
		fechaDesde: Date = null,
		fechaHasta: Date = null,
        etiqueta: string = ""
	)
	{
		this.idEstadoPlanPagoDefinicion = idEstadoPlanPagoDefinicion;
		this.idTipoPlanPago = idTipoPlanPago;
		this.idTipoTributo = idTipoTributo;
		this.idTasaPlanPago = idTasaPlanPago;
		this.idSubTasaPlanPago = idSubTasaPlanPago;
		this.descripcion = descripcion;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
        this.etiqueta = etiqueta;
	}
}
