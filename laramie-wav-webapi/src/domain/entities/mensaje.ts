export default class Mensaje {

	idCanal: number;
	idPrioridad: number;
	identificador: string;
	titulo: string;
	cuerpo: string;

	constructor(
		idCanal: number = 0,
		idPrioridad: number = 0,
		identificador: string = "",
		titulo: string = "",
		cuerpo: string = ""
	)
	{
		this.idCanal = idCanal;
		this.idPrioridad = idPrioridad;
		this.identificador = identificador;
		this.titulo = titulo;
		this.cuerpo = cuerpo;
	}

	setFromObject = (row) =>
	{
		this.idCanal = row.idCanal ?? 0;
		this.idPrioridad = row.idPrioridad ?? 0;
		this.identificador = row.identificador ?? "";
		this.titulo = row.titulo ?? "";
		this.cuerpo = row.cuerpo ?? "";
	}

}
