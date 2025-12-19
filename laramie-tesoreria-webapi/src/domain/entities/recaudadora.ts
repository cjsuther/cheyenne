export default class Recaudadora {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	codigoCliente: string;
	idLugarPago: number;
	idMetodoImportacion: number;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		codigoCliente: string = "",
		idLugarPago: number = 0,
		idMetodoImportacion: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.codigoCliente = codigoCliente;
		this.idLugarPago = idLugarPago;
		this.idMetodoImportacion = idMetodoImportacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.codigoCliente = row.codigoCliente ?? "";
		this.idLugarPago = row.idLugarPago ?? 0;
		this.idMetodoImportacion = row.idMetodoImportacion ?? 0;
	}

}
