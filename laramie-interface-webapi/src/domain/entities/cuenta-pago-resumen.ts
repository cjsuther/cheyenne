export default class CuentaPagoResumen {

    id: number;
	idCuenta: number;
	numero: string;
	importeVencimiento: number;
	fechaVencimiento: Date;
	codigoBarras: string;

	constructor(
        id: number = 0,
		idCuenta: number = 0,
		numero: string = "",
		importeVencimiento: number = 0,
		fechaVencimiento: Date = null,
		codigoBarras: string = ""
	)
	{
        this.id = id;
		this.idCuenta = idCuenta;
		this.numero = numero;
		this.importeVencimiento = importeVencimiento;
		this.fechaVencimiento = fechaVencimiento;
		this.codigoBarras = codigoBarras;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.numero = row.numero ?? "";
		this.importeVencimiento = row.importeVencimiento ?? 0;
		this.fechaVencimiento = row.fechaVencimiento ?? null;
		this.codigoBarras = row.codigoBarras;
	}

}
