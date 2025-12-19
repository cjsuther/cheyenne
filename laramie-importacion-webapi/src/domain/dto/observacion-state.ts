import Observacion from "../entities/observacion";

export default class ObservacionState extends Observacion {

    state: string;

	constructor(
        id: number = 0,
		entidad: string = "",
		idEntidad: number = 0,
		detalle: string = "",
		idUsuario: number = 0,
		fecha: Date = null,
		state: string = "o"
	)
	{
        super(id, entidad, idEntidad, detalle, idUsuario, fecha);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.entidad = row.entidad ?? "";
		this.idEntidad = row.idEntidad ?? 0;
		this.detalle = row.detalle ?? "";
		this.idUsuario = row.idUsuario ?? 0;
		this.fecha = row.fecha ?? null;
		this.state = row.state ?? "o";
	}

}
