export default class Acceso {

    id: number;
	idUsuario: number;
	idTipoAcceso: number;
	identificador: string;
	password: string;

	constructor(
        id: number = 0,
		idUsuario: number = 0,
		idTipoAcceso: number = 0,
		identificador: string = "",
		password: string = ""
	)
	{
        this.id = id;
		this.idUsuario = idUsuario;
		this.idTipoAcceso = idTipoAcceso;
		this.identificador = identificador;
		this.password = password;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idUsuario = row.idUsuario ?? 0;
		this.idTipoAcceso = row.idTipoAcceso ?? 0;
		this.identificador = row.identificador ?? "";
		this.password = row.password ?? "";
	}

}
