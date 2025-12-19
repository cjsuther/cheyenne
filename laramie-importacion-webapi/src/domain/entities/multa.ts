export default class Multa {

    id: number;
	idCuenta: number;
	idTipoMulta: number;
	idUnidadValor: number;
	valor: number;
	periodo: string;
	mes: number;
	fecha: Date;
	idTasa: number;
	idSubTasa: number;
	idCuentaPago: number;

	constructor(
        id: number = 0,
		idCuenta: number = 0,
		idTipoMulta: number = 0,
		idUnidadValor: number = 0,
		valor: number = 0,
		periodo: string = "",
		mes: number = 0,
		fecha: Date = null,
		idTasa: number = 0,
		idSubTasa: number = 0,
		idCuentaPago: number = 0
	)
	{
        this.id = id;
		this.idCuenta = idCuenta;
		this.idTipoMulta = idTipoMulta;
		this.idUnidadValor = idUnidadValor;
		this.valor = valor;
		this.periodo = periodo;
		this.mes = mes;
		this.fecha = fecha;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.idCuentaPago = idCuentaPago;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTipoMulta = row.idTipoMulta ?? 0;
		this.idUnidadValor = row.idUnidadValor ?? 0;
		this.valor = row.valor ?? 0;
		this.periodo = row.periodo ?? "";
		this.mes = row.mes ?? 0;
		this.fecha = row.fecha ?? null;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.idCuentaPago = row.idCuentaPago ?? 0;
	}

}
