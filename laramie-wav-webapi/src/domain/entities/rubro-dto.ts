import TipoDeclaracionJuradaDto from "./tipo-declaracion-jurada-dto";

export default class RubroDto {

	id: number;
	codigo: string;
	nombre: string;
	alicuota:number;
	tiposDeclaracionJurada: TipoDeclaracionJuradaDto[] = [];

	constructor()
	{
        this.id = 0;
		this.codigo = "";
		this.nombre = "";
		this.alicuota = 0;
		this.tiposDeclaracionJurada = [];
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
        this.alicuota = row.alicuota ?? 0;
	}

}
