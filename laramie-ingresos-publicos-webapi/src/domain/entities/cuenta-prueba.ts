export default class CuentaPrueba {

    id: number;
	idTipoTributo: number;
	idCuenta: number;
	comentario: string;
	numeroCuenta?: string;

	constructor(
        id: number = 0,
		idTipoTributo: number = 0,
		idCuenta: number = 0,
		comentario: string = "",
		numeroCuenta: string = "",
	)
	{
        this.id = id;
		this.idTipoTributo = idTipoTributo;
		this.idCuenta = idCuenta;
		this.comentario = comentario;
		this.numeroCuenta = numeroCuenta;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.comentario = row.comentario ?? "";
		this.numeroCuenta = row.cuenta?.numeroCuenta ?? "";
	}

}
