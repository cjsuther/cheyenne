export default class Elemento {

    id: number;
	idClaseElemento: number;
	idTipoElemento: number;
	idCuenta: number;
	cantidad: number;
	fechaAlta: Date;
	fechaBaja: Date;

	constructor(
        id: number = 0,
		idClaseElemento: number = 0,
		idTipoElemento: number = 0,
		idCuenta: number = 0,
		cantidad: number = 0,
		fechaAlta: Date = null,
		fechaBaja: Date = null
	)
	{
        this.id = id;
		this.idClaseElemento = idClaseElemento;
		this.idTipoElemento = idTipoElemento;
		this.idCuenta = idCuenta;
		this.cantidad = cantidad;
		this.fechaAlta = fechaAlta;
		this.fechaBaja = fechaBaja;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idClaseElemento = row.idClaseElemento ?? 0;
		this.idTipoElemento = row.idTipoElemento ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.cantidad = row.cantidad ?? 0;
		this.fechaAlta = row.fechaAlta ?? null;
		this.fechaBaja = row.fechaBaja ?? null;
	}

}
