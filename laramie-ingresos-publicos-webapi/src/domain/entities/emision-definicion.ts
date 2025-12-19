export default class EmisionDefinicion {

    id: number;
	idTipoTributo: number;
	idNumeracion: number;
	idProcedimiento: number;
	idEstadoEmisionDefinicion: number;
	idEmisionDefinicionBase: number;
	codigoDelegacion: string;
	numero: string;
	descripcion: string;
	periodo: string;
	procesaPlanes: boolean;
	procesaRubros: boolean;
	procesaElementos: boolean;
	calculoMostradorWeb: boolean;
	calculoMasivo: boolean;
	calculoPagoAnticipado: boolean;
	fechaReliquidacionDesde: Date;
	fechaReliquidacionHasta: Date;
	modulo: string;

	constructor(
        id: number = 0,
		idTipoTributo: number = 0,
		idNumeracion: number = 0,
		idProcedimiento: number = 0,
		idEstadoEmisionDefinicion: number = 0,
		idEmisionDefinicionBase: number = 0,
		numero: string = "",
		descripcion: string = "",
		codigoDelegacion: string = "",
		periodo: string = "",
		procesaPlanes: boolean = false,
		procesaRubros: boolean = false,
		procesaElementos: boolean = false,
		calculoMostradorWeb: boolean = false,
		calculoMasivo: boolean = false,
		calculoPagoAnticipado: boolean = false,
		fechaReliquidacionDesde: Date = null,
		fechaReliquidacionHasta: Date = null,
		modulo: string = ""
	)
	{
        this.id = id;
		this.idTipoTributo = idTipoTributo;
		this.idNumeracion = idNumeracion;
		this.idProcedimiento = idProcedimiento;
		this.idEstadoEmisionDefinicion = idEstadoEmisionDefinicion;
		this.idEmisionDefinicionBase = idEmisionDefinicionBase;
		this.numero = numero;
		this.descripcion = descripcion;
		this.codigoDelegacion = codigoDelegacion;
		this.periodo = periodo;
		this.procesaPlanes = procesaPlanes;
		this.procesaRubros = procesaRubros;
		this.procesaElementos = procesaElementos;
		this.calculoMostradorWeb = calculoMostradorWeb;
		this.calculoMasivo = calculoMasivo;
		this.calculoPagoAnticipado = calculoPagoAnticipado;
		this.fechaReliquidacionDesde = fechaReliquidacionDesde;
		this.fechaReliquidacionHasta = fechaReliquidacionHasta;
		this.modulo = modulo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.idNumeracion = row.idNumeracion ?? 0;
		this.idProcedimiento = row.idProcedimiento ?? 0;
		this.idEstadoEmisionDefinicion = row.idEstadoEmisionDefinicion ?? 0;
		this.idEmisionDefinicionBase = row.idEmisionDefinicionBase ?? 0;
		this.numero = row.numero ?? "";
		this.descripcion = row.descripcion ?? "";
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.periodo = row.periodo ?? "";
		this.procesaPlanes = row.procesaPlanes ?? false;
		this.procesaRubros = row.procesaRubros ?? false;
		this.procesaElementos = row.procesaElementos ?? false;
		this.calculoMostradorWeb = row.calculoMostradorWeb ?? false;
		this.calculoMasivo = row.calculoMasivo ?? false;
		this.calculoPagoAnticipado = row.calculoPagoAnticipado ?? false;		
		this.fechaReliquidacionDesde = row.fechaReliquidacionDesde ?? null;
		this.fechaReliquidacionHasta = row.fechaReliquidacionHasta ?? null;
		this.modulo = row.modulo ?? "";
	}

}
