export default class PagoContadoDefinicionFilter {

	idTipoPlanPago: number;
	idTipoTributo: number;
	idTasaPagoContado: number;
	idSubTasaPagoContado: number;
    idEstadoPagoContadoDefinicion: number;
	fechaDesde: Date;
	fechaHasta: Date;
    descripcion: string;
    etiqueta: string;

	constructor(
		idTipoPlanPago: number = 0,
		idTipoTributo: number = 0,
		idTasaPagoContado: number = 0,
		idSubTasaPagoContado: number = 0,
        idEstadoPagoContadoDefinicion: number = 0,
		fechaDesde: Date = null,
		fechaHasta: Date = null,
        descripcion: string = "",
        etiqueta: string = ""
	)
	{
		this.idTipoPlanPago = idTipoPlanPago;
		this.idTipoTributo = idTipoTributo;
		this.idTasaPagoContado = idTasaPagoContado;
		this.idSubTasaPagoContado = idSubTasaPagoContado;
        this.idEstadoPagoContadoDefinicion = idEstadoPagoContadoDefinicion;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
        this.descripcion = descripcion;
        this.etiqueta = etiqueta;
	}
}
