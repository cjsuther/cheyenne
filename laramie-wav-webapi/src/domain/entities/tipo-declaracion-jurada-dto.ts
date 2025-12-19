export default class TipoDeclaracionJuradaDto {

	id: number;
	codigo: string;
	nombre: string;
	idUnidadMedida: number;
	orden: number;

	constructor()
	{
        this.id = 0;
		this.codigo = "";
		this.nombre = "";
		this.idUnidadMedida = 0;
        this.orden = 0;
	}

	setFromObject = (row) =>
	{
		this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.idUnidadMedida = row.idUnidadMedida ?? 0;
		this.orden = row.orden ?? 0;
	}

}
