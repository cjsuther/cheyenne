export default class ZonaEntrega {

    id: number;
	idCuenta: number;
	idTipoControlador: number;
	email: string;

	constructor(
        id: number = 0,
		idCuenta: number = 0,
		idTipoControlador: number = 0,
		email: string = ""
	)
	{
        this.id = id;
		this.idCuenta = idCuenta;
		this.idTipoControlador = idTipoControlador;
		this.email = email;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTipoControlador = row.idTipoControlador ?? 0;
		this.email = row.email;
	}

}
