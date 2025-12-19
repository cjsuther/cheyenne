export default class CodigoBarrasCliente {

    id: number;
	idTipoCodigoBarras: number;
	codigoBarras: string;
	codigoBarrasCliente: string;

	constructor(
        id: number = 0,
		idTipoCodigoBarras: number = 0,
		codigoBarras: string = "",
		codigoBarrasCliente: string = ""
	)
	{
        this.id = id;
		this.idTipoCodigoBarras = idTipoCodigoBarras;
		this.codigoBarras = codigoBarras;
		this.codigoBarrasCliente = codigoBarrasCliente;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoCodigoBarras = row.idTipoCodigoBarras ?? 0;
		this.codigoBarras = row.codigoBarras ?? "";
		this.codigoBarrasCliente = row.codigoBarrasCliente ?? "";
	}

}
