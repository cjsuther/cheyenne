import JuicioCitacion from "../entities/juicio-citacion";

export default class JuicioCitacionState extends JuicioCitacion {

    state: string;

	constructor(
        id: number = 0,
		idApremio: number = 0,
		fechaCitacion: Date = null,
		idTipoCitacion: number = 0,
		observacion: string = "",
		state: string = "o"
	)
	{
		super(
			id, idApremio, fechaCitacion, idTipoCitacion, observacion
		);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idApremio = row.idApremio ?? 0;
		this.fechaCitacion = row.fechaCitacion ?? null;
		this.idTipoCitacion = row.idTipoCitacion ?? 0;
		this.observacion = row.observacion ?? "";
		this.state = row.state ?? "o";
	}

}