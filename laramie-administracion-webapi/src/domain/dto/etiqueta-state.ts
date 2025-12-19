import Etiqueta from "../entities/etiqueta";

export default class EtiquetaState extends Etiqueta {

    state: string;

	constructor(
        id: number = 0,
		entidad: string = "",
		idEntidad: number = 0,
		codigo: string = "",
		state: string = "o"
	)
	{
        super(id, entidad, idEntidad, codigo);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.entidad = row.entidad ?? "";
		this.idEntidad = row.idEntidad ?? 0;
		this.codigo = row.codigo ?? "";
		this.state = row.state ?? "o";
	}

}
