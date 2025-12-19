import RubroDto from "./rubro-dto";

export default class ClaseDeclaracionJuradaDto {

	id: number;
	codigo: string;
	nombre: string;
	aplicaRubro: boolean;
	rubros: RubroDto[];

	constructor()
	{
        this.id = 0;
		this.codigo = "";
		this.nombre = "";
		this.aplicaRubro = false;
		this.rubros = [];
	}

	setFromObject = (row) =>
	{
		this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.aplicaRubro = row.aplicaRubro ?? false;
	}

}
