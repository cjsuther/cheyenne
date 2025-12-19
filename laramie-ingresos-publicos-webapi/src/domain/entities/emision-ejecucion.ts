export default class EmisionEjecucion {

    id: number;
	idEmisionDefinicion: number;
	idEstadoEmisionEjecucion: number;
	numero: string;
	descripcion: string;
	descripcionAbreviada: string;
	periodo: string;
	imprimeRecibosEmision: boolean;
	aplicaDebitoAutomatico: boolean;
	calculoMostradorWeb: boolean;
	calculoMasivo: boolean;
	calculoPrueba: boolean;
	calculoPagoAnticipado: boolean;
	fechaPagoAnticipadoVencimiento1: Date;
	fechaPagoAnticipadoVencimiento2: Date;
	fechaEjecucionInicio: Date;
	fechaEjecucionFin: Date;

	constructor(
        id: number = 0,
		idEmisionDefinicion: number = 0,
		idEstadoEmisionEjecucion: number = 0,
		numero: string = "",
		descripcion: string = "",
		descripcionAbreviada: string = "",
		periodo: string = "",
		imprimeRecibosEmision: boolean = false,
		aplicaDebitoAutomatico: boolean = false,
		calculoMostradorWeb: boolean = false,
		calculoMasivo: boolean = false,
		calculoPrueba: boolean = false,
		calculoPagoAnticipado: boolean = false,
		fechaPagoAnticipadoVencimiento1: Date = null,
		fechaPagoAnticipadoVencimiento2: Date = null,
		fechaEjecucionInicio: Date = null,
		fechaEjecucionFin: Date = null
	)
	{
        this.id = id;
		this.idEmisionDefinicion = idEmisionDefinicion;
		this.idEstadoEmisionEjecucion = idEstadoEmisionEjecucion;
		this.numero = numero;
		this.descripcion = descripcion;
		this.descripcionAbreviada = descripcionAbreviada;
		this.periodo = periodo;
		this.imprimeRecibosEmision = imprimeRecibosEmision;
		this.aplicaDebitoAutomatico = aplicaDebitoAutomatico;
		this.calculoMostradorWeb = calculoMostradorWeb;
		this.calculoMasivo = calculoMasivo;
		this.calculoPrueba = calculoPrueba;
		this.calculoPagoAnticipado = calculoPagoAnticipado;
		this.fechaPagoAnticipadoVencimiento1 = fechaPagoAnticipadoVencimiento1;
		this.fechaPagoAnticipadoVencimiento2 = fechaPagoAnticipadoVencimiento2;
		this.fechaEjecucionInicio = fechaEjecucionInicio;
		this.fechaEjecucionFin = fechaEjecucionFin;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionDefinicion = row.idEmisionDefinicion ?? 0;
		this.idEstadoEmisionEjecucion = row.idEstadoEmisionEjecucion ?? 0;
		this.numero = row.numero ?? "";
		this.descripcion = row.descripcion ?? "";
		this.descripcionAbreviada = row.descripcionAbreviada ?? "";
		this.periodo = row.periodo ?? "";
		this.imprimeRecibosEmision = row.imprimeRecibosEmision ?? false;
		this.aplicaDebitoAutomatico = row.aplicaDebitoAutomatico ?? false;
		this.calculoMostradorWeb = row.calculoMostradorWeb ?? false;
		this.calculoMasivo = row.calculoMasivo ?? false;
		this.calculoPrueba = row.calculoPrueba ?? false;
		this.calculoPagoAnticipado = row.calculoPagoAnticipado ?? false;
		this.fechaPagoAnticipadoVencimiento1 = row.fechaPagoAnticipadoVencimiento1 ?? null;
		this.fechaPagoAnticipadoVencimiento2 = row.fechaPagoAnticipadoVencimiento2 ?? null;
		this.fechaEjecucionInicio = row.fechaEjecucionInicio ?? null;
		this.fechaEjecucionFin = row.fechaEjecucionFin ?? null;
	}

}
