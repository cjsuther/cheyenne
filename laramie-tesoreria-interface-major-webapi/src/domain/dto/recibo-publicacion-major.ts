export default class ReciboPublicacionMajor {

	pagoItem:number;
	edesCliente:number;
	juceNumero:number;
	lugaCodigo:number;
	cajaCodigo:number;
	dtriCodigo:number;
	tribCuenta:string;
	rublCodigo:string;
	ttasTasa:number;
	ttasSubTasa:number;
	tcuoCodigo:number;
	pagoNumeroCartel:number;
	pagoPeriodo:number;
	pagoCuota:string;
	pagoImporte:number;
	pagoACancelar:number;
	pagoVtoTermino:string;
	pagoDigitoVerificador:number;
	pagoEmiPeri:number;
	pagoEmiNro:number;
	pagoPerGen:number;
	pagoFechaCobro:string;

	constructor(
		pagoItem:number = 0,
		edesCliente:number = 0,
		juceNumero:number = 0,
		lugaCodigo:number = 0,
		cajaCodigo:number = 0,
		dtriCodigo:number = 0,
		tribCuenta:string = "",
		rublCodigo:string = "",
		ttasTasa:number = 0,
		ttasSubTasa:number = 0,
		tcuoCodigo:number = 0,
		pagoNumeroCartel:number = 0,
		pagoPeriodo:number = 0,
		pagoCuota:string = "",
		pagoImporte:number = 0,
		pagoACancelar:number = 0,
		pagoVtoTermino:string = "",
		pagoDigitoVerificador:number = 0,
		pagoEmiPeri:number = 0,
		pagoEmiNro:number = 0,
		pagoPerGen:number = 0,
		pagoFechaCobro:string = ""
	)
	{
		this.pagoItem = pagoItem;
		this.edesCliente = edesCliente;
		this.juceNumero = juceNumero;
		this.lugaCodigo = lugaCodigo;
		this.cajaCodigo = cajaCodigo;
		this.dtriCodigo = dtriCodigo;
		this.tribCuenta = tribCuenta;
		this.rublCodigo = rublCodigo;
		this.ttasTasa = ttasTasa;
		this.ttasSubTasa = ttasSubTasa;
		this.tcuoCodigo = tcuoCodigo;
		this.pagoNumeroCartel = pagoNumeroCartel;
		this.pagoPeriodo = pagoPeriodo;
		this.pagoCuota = pagoCuota;
		this.pagoImporte = pagoImporte;
		this.pagoACancelar = pagoACancelar;
		this.pagoVtoTermino = pagoVtoTermino;
		this.pagoDigitoVerificador = pagoDigitoVerificador;
		this.pagoEmiPeri = pagoEmiPeri;
		this.pagoEmiNro = pagoEmiNro;
		this.pagoPerGen = pagoPerGen;
		this.pagoFechaCobro = pagoFechaCobro;
	}

	setFromObject = (row) =>
	{
		this.pagoItem = row.pagoItem ?? 0;
		this.edesCliente = row.edesCliente ?? 0;
		this.juceNumero = row.juceNumero ?? 0;
		this.lugaCodigo = row.lugaCodigo ?? 0;
		this.cajaCodigo = row.cajaCodigo ?? 0;
		this.dtriCodigo = row.dtriCodigo ?? 0;
		this.tribCuenta = row.tribCuenta ?? "";
		this.rublCodigo = row.rublCodigo ?? "";
		this.ttasTasa = row.ttasTasa ?? 0;
		this.ttasSubTasa = row.ttasSubTasa ?? 0;
		this.tcuoCodigo = row.tcuoCodigo ?? 0;
		this.pagoNumeroCartel = row.pagoNumeroCartel ?? 0;
		this.pagoPeriodo = row.pagoPeriodo ?? 0;
		this.pagoCuota = row.pagoCuota ?? "";
		this.pagoImporte = row.pagoImporte ?? 0;
		this.pagoACancelar = row.pagoACancelar ?? 0;
		this.pagoVtoTermino = row.pagoVtoTermino ?? "";
		this.pagoDigitoVerificador = row.pagoDigitoVerificador ?? 0;
		this.pagoEmiPeri = row.pagoEmiPeri ?? 0;
		this.pagoEmiNro = row.pagoEmiNro ?? 0;
		this.pagoPerGen = row.pagoPerGen ?? 0;
		this.pagoFechaCobro = row.pagoFechaCobro ?? "";
	}

	getRow(pagoCodigoDelegacion:string, pagoNumero:string, delim:string) {
		return `${pagoCodigoDelegacion}${delim}${pagoNumero}${delim}${this.pagoItem}${delim}${this.edesCliente}${delim}${this.juceNumero}${delim}${this.lugaCodigo}${delim}${this.cajaCodigo}${delim}${this.dtriCodigo}${delim}${this.tribCuenta}${delim}${this.rublCodigo}${delim}${this.ttasTasa}${delim}${this.ttasSubTasa}${delim}${this.tcuoCodigo}${delim}${this.pagoNumeroCartel}${delim}${this.pagoPeriodo}${delim}${this.pagoCuota}${delim}${this.pagoImporte}${delim}${this.pagoACancelar}${delim}${this.pagoVtoTermino}${delim}${this.pagoDigitoVerificador}${delim}${this.pagoEmiPeri}${delim}${this.pagoEmiNro}${delim}${this.pagoPerGen}${delim}${this.pagoFechaCobro}`;
	}

}
