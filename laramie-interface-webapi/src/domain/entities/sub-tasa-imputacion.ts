export default class SubTasaImputacion {

    id: number;
	idTasa: number;
	idSubTasa: number;
	ejercicio: string;
	idTipoCuota: number;
	idCuentaContable: number;
	idCuentaContableAnterior: number;
	idCuentaContableFutura: number;
	idJurisdiccionActual: number;
	idRecursoPorRubroActual: number;
	idJurisdiccionAnterior: number;
	idRecursoPorRubroAnterior: number;
	idJurisdiccionFutura: number;
	idRecursoPorRubroFutura: number;
	codigoFormaPago: string;
	codigoTipoRecaudacion: string;

	constructor(
        id: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		ejercicio: string = "",
		idTipoCuota: number = 0,
		idCuentaContable: number = 0,
		idCuentaContableAnterior: number = 0,
		idCuentaContableFutura: number = 0,
		idJurisdiccionActual: number = 0,
		idRecursoPorRubroActual: number = 0,
		idJurisdiccionAnterior: number = 0,
		idRecursoPorRubroAnterior: number = 0,
		idJurisdiccionFutura: number = 0,
		idRecursoPorRubroFutura: number = 0,
		codigoFormaPago: string = "",
		codigoTipoRecaudacion: string = "",
	)
	{
        this.id = id;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.ejercicio = ejercicio;
		this.idTipoCuota = idTipoCuota;
		this.idCuentaContable = idCuentaContable;
		this.idCuentaContableAnterior = idCuentaContableAnterior;
		this.idCuentaContableFutura = idCuentaContableFutura;
		this.idJurisdiccionActual = idJurisdiccionActual;
		this.idRecursoPorRubroActual = idRecursoPorRubroActual;
		this.idJurisdiccionAnterior = idJurisdiccionAnterior;
		this.idRecursoPorRubroAnterior = idRecursoPorRubroAnterior;
		this.idJurisdiccionFutura = idJurisdiccionFutura;
		this.idRecursoPorRubroFutura = idRecursoPorRubroFutura;
		this.codigoFormaPago = codigoFormaPago;
		this.codigoTipoRecaudacion = codigoTipoRecaudacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.ejercicio = row.ejercicio ?? "";
		this.idTipoCuota = row.idTipoCuota ?? 0;
		this.idCuentaContable = row.idCuentaContable ?? 0;
		this.idCuentaContableAnterior = row.idCuentaContableAnterior ?? 0;
		this.idCuentaContableFutura = row.idCuentaContableFutura ?? 0;
		this.idJurisdiccionActual = row.idJurisdiccionActual ?? 0;
		this.idRecursoPorRubroActual = row.idRecursoPorRubroActual ?? 0;
		this.idJurisdiccionAnterior = row.idJurisdiccionAnterior ?? 0;
		this.idRecursoPorRubroAnterior = row.idRecursoPorRubroAnterior ?? 0;
		this.idJurisdiccionFutura = row.idJurisdiccionFutura ?? 0;
		this.idRecursoPorRubroFutura = row.idRecursoPorRubroFutura ?? 0;
		this.codigoFormaPago = row.codigoFormaPago ?? "";
		this.codigoTipoRecaudacion = row.codigoTipoRecaudacion ?? "";
	}

}
