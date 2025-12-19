export default class LadoTerreno {

    id: number;
	idInmueble: number;
	idTipoLado: number;
	numero: number;
	metros: number;
	reduccion: number;

	constructor(
        id: number = 0,
		idInmueble: number = 0,
		idTipoLado: number = 0,
		numero: number = 0,
		metros: number = 0,
		reduccion: number = 0
	)
	{
        this.id = id;
		this.idInmueble = idInmueble;
		this.idTipoLado = idTipoLado;
		this.numero = numero;
		this.metros = metros;
		this.reduccion = reduccion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idInmueble = row.idInmueble ?? 0;
		this.idTipoLado = row.idTipoLado ?? 0;
		this.numero = row.numero ?? 0;
		this.metros = row.metros ?? 0;
		this.reduccion = row.reduccion ?? 0;
	}

}
