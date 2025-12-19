export default class ColeccionCampo {

    id: number;
	idColeccion: number;
	idTipoVariable: number;
	campo: string;
	codigo: string;
	nombre: string;
	tipoDato: string;
	orden: number;

	constructor(
        id: number = 0,
		idColeccion: number = 0,
		idTipoVariable: number = 0,
		campo: string = "",
		codigo: string = "",
		nombre: string = "",
		tipoDato: string = "",
		orden: number = 0
	)
	{
        this.id = id;
		this.idColeccion = idColeccion;
		this.idTipoVariable = idTipoVariable;
		this.campo = campo;
		this.codigo = codigo;
		this.nombre = nombre;
		this.tipoDato = tipoDato;
		this.orden = orden;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idColeccion = row.idColeccion ?? 0;
		this.idTipoVariable = row.idTipoVariable ?? 0;
		this.campo = row.campo ?? "";
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.tipoDato = row.tipoDato ?? "";
		this.orden = row.orden ?? 0;
	}

}
