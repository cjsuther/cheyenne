export default class Contacto {

    id: number;
	entidad: string;
	idEntidad: number;
	idTipoContacto: number;
	detalle: string;

	constructor(
        id: number = 0,
		entidad: string = "",
		idEntidad: number = 0,
		idTipoContacto: number = 0,
		detalle: string = ""
	)
	{
        this.id = id;
		this.entidad = entidad;
		this.idEntidad = idEntidad;
		this.idTipoContacto = idTipoContacto;
		this.detalle = detalle;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.entidad = row.entidad ?? "";
		this.idEntidad = row.idEntidad ?? 0;
		this.idTipoContacto = row.idTipoContacto ?? 0;
		this.detalle = row.detalle ?? "";
	}

}
