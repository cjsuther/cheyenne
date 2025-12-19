export default class CuentaCorrienteItem {

    id: number;
	idCuentaCorriente: number;
	idEmisionEjecucion: number;
	idEmisionCuentaCorrienteResultado: number;
	idPlanPago: number;
	idPlanPagoCuota: number;
	idCertificadoApremio: number;
	idCuenta: number;
	idTasa: number;
	idSubTasa: number;
	periodo: string;
	cuota: number;
	idRubro: number;
	codigoDelegacion: string;
	idTipoMovimiento: number;
	numeroMovimiento: number;
	numeroPartida: number;
	tasaCabecera: boolean;
	idTipoValor: number;
	importeDebe: number;
	importeHaber: number;
	idLugarPago: number;
	fechaOrigen: Date;
	fechaMovimiento: Date;
	fechaVencimiento1: Date;
	fechaVencimiento2: Date;
	fechaVencimiento1Original: Date;
	fechaVencimiento2Original: Date;
	fechaVencimiento1Prorroga: Date;
	fechaVencimiento2Prorroga: Date;
	cantidad: number;
	idEdesurCliente: number;
	detalle: string;
	item: number;
	idUsuarioRegistro: number;
	fechaRegistro: Date;
	idUsuarioProceso: number;
	fechaProceso: Date;
	fechaCobro: Date;

	constructor(
        id: number = 0,
		idCuentaCorriente: number = 0,
		idEmisionEjecucion: number = 0,
		idEmisionCuentaCorrienteResultado: number = 0,
		idPlanPago: number = 0,
		idPlanPagoCuota: number = 0,
		idCertificadoApremio: number = 0,
		idCuenta: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		periodo: string = "",
		cuota: number = 0,
		idRubro: number = 0,
		codigoDelegacion: string = "",
		idTipoMovimiento: number = 0,
		numeroMovimiento: number = 0,
		numeroPartida: number = 0,
		tasaCabecera: boolean = false,
		idTipoValor: number = 0,
		importeDebe: number = 0,
		importeHaber: number = 0,
		idLugarPago: number = 0,
		fechaOrigen: Date = null,
		fechaMovimiento: Date = null,
		fechaVencimiento1: Date = null,
		fechaVencimiento2: Date = null,
		fechaVencimiento1Original: Date = null,
		fechaVencimiento2Original: Date = null,
		fechaVencimiento1Prorroga: Date = null,
		fechaVencimiento2Prorroga: Date = null,
		cantidad: number = 0,
		idEdesurCliente: number = 0,
		detalle: string = "",
		item: number = 0,
		idUsuarioRegistro: number = 0,
		fechaRegistro: Date = null,
		idUsuarioProceso: number = 0,
		fechaProceso: Date = null,
		fechaCobro: Date = null
	)
	{
        this.id = id;
		this.idCuentaCorriente = idCuentaCorriente;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idEmisionCuentaCorrienteResultado = idEmisionCuentaCorrienteResultado;
		this.idPlanPago = idPlanPago;
		this.idPlanPagoCuota = idPlanPagoCuota;
		this.idCertificadoApremio = idCertificadoApremio;
		this.idCuenta = idCuenta;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.periodo = periodo;
		this.cuota = cuota;
		this.idRubro = idRubro;
		this.codigoDelegacion = codigoDelegacion;
		this.idTipoMovimiento = idTipoMovimiento;
		this.numeroMovimiento = numeroMovimiento;
		this.numeroPartida = numeroPartida;
		this.tasaCabecera = tasaCabecera;
		this.idTipoValor = idTipoValor;
		this.importeDebe = importeDebe;
		this.importeHaber = importeHaber;
		this.idLugarPago = idLugarPago;
		this.fechaOrigen = fechaOrigen;
		this.fechaMovimiento = fechaMovimiento;
		this.fechaVencimiento1 = fechaVencimiento1;
		this.fechaVencimiento2 = fechaVencimiento2;
		this.fechaVencimiento1Original = fechaVencimiento1Original;
		this.fechaVencimiento2Original = fechaVencimiento2Original;
		this.fechaVencimiento1Prorroga = fechaVencimiento1Prorroga;
		this.fechaVencimiento2Prorroga = fechaVencimiento2Prorroga;
		this.cantidad = cantidad;
		this.idEdesurCliente = idEdesurCliente;
		this.detalle = detalle;
		this.item = item;
		this.idUsuarioRegistro = idUsuarioRegistro;
		this.fechaRegistro = fechaRegistro;
		this.idUsuarioProceso = idUsuarioProceso;
		this.fechaProceso = fechaProceso;
		this.fechaCobro = fechaCobro;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
        this.idCuentaCorriente = row.idCuentaCorriente ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idEmisionCuentaCorrienteResultado = row.idEmisionCuentaCorrienteResultado ?? 0;
		this.idPlanPago = row.idPlanPago ?? 0;
		this.idPlanPagoCuota = row.idPlanPagoCuota ?? 0;
		this.idCertificadoApremio = row.idCertificadoApremio ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.idRubro = row.idRubro ?? 0;
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.idTipoMovimiento = row.idTipoMovimiento ?? 0;
		this.numeroMovimiento = row.numeroMovimiento ?? 0;
		this.numeroPartida = row.numeroPartida ?? 0;
		this.tasaCabecera = row.tasaCabecera ?? false;
		this.idTipoValor = row.idTipoValor ?? 0;
		this.importeDebe = row.importeDebe ?? 0;
		this.importeHaber = row.importeHaber ?? 0;
		this.idLugarPago = row.idLugarPago ?? 0;
		this.fechaOrigen = row.fechaOrigen ?? null;
		this.fechaMovimiento = row.fechaMovimiento ?? null;
		this.fechaVencimiento1 = row.fechaVencimiento1 ?? null;
		this.fechaVencimiento2 = row.fechaVencimiento2 ?? null;
		this.fechaVencimiento1Original = row.fechaVencimiento1Original ?? null;
		this.fechaVencimiento2Original = row.fechaVencimiento2Original ?? null;
		this.fechaVencimiento1Prorroga = row.fechaVencimiento1Prorroga ?? null;
		this.fechaVencimiento2Prorroga = row.fechaVencimiento2Prorroga ?? null;
		this.cantidad = row.cantidad ?? 0;
		this.idEdesurCliente = row.idEdesurCliente ?? 0;
		this.detalle = row.detalle ?? 0;
		this.item = row.item ?? 0;
		this.idUsuarioRegistro = row.idUsuarioRegistro ?? 0;
		this.fechaRegistro = row.fechaRegistro ?? null;
		this.idUsuarioProceso = row.idUsuarioProceso ?? "";
		this.fechaProceso = row.fechaProceso ?? null;
		this.fechaCobro = row.fechaCobro ?? null;
	}

}
