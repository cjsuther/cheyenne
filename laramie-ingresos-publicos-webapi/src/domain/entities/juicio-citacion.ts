export default class JuicioCitacion {

    id: number;
	idApremio: number;
	fechaCitacion: Date;
	idTipoCitacion: number;
	observacion: string;

	constructor(
        id: number = 0,
		idApremio: number = 0,
		fechaCitacion: Date = null,
		idTipoCitacion: number = 0,
		observacion: string = ""
	)
	{
        this.id = id;
		this.idApremio = idApremio;
		this.fechaCitacion = fechaCitacion;
		this.idTipoCitacion = idTipoCitacion;
		this.observacion = observacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idApremio = row.idApremio ?? 0;
		this.fechaCitacion = row.fechaCitacion ?? null;
		this.idTipoCitacion = row.idTipoCitacion ?? 0;
		this.observacion = row.observacion ?? "";
	}

}
