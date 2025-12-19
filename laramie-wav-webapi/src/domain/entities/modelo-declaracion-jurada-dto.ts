import ClaseDeclaracionJuradaDto from "./clase-declaracion-jurada-dto";

export default class ModeloDeclaracionJuradaDto {

	id: number;
	codigo: string;
	nombre: string;
    clasesDeclaracionJurada: ClaseDeclaracionJuradaDto[];

	constructor()
	{
        this.id = 0;
		this.codigo = "";
		this.nombre = "";
        this.clasesDeclaracionJurada = [];
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
	}

}
