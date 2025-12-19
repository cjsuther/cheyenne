export default class Etiqueta {

    id: number;
	entidad: string;
	idEntidad: number;
	codigo: string;

	constructor(
        id: number = 0,
		entidad: string = "",
		idEntidad: number = 0,
		codigo: string = ""
	)
	{
        this.id = id;
		this.entidad = entidad;
		this.idEntidad = idEntidad;
		this.codigo = codigo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.entidad = row.entidad ?? "";
		this.idEntidad = row.idEntidad ?? 0;
		this.codigo = row.codigo ?? "";
	}

}
