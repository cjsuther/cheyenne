export default class TipoRelacionCertificadoApremioPersona {

    id: number;
	codigo: string;
	descripcion: string;
	idTipoControlador: number;

	constructor(
        id: number = 0,
		codigo: string = "",
		descripcion: string = "",
		idTipoControlador: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.descripcion = descripcion;
		this.idTipoControlador = idTipoControlador;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.descripcion = row.descripcion ?? "";
		this.idTipoControlador = row.idTipoControlador ?? 0;
	}

}
