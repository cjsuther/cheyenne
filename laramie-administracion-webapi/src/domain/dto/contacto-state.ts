import Contacto from '../entities/contacto';

export default class ContactoState extends Contacto {

	state: string;

	constructor(
        id: number = 0,
		entidad: string = "",
		idEntidad: number = 0,
		idTipoContacto: number = 0,
		detalle: string = "",
		state: string = "o"
	)
	{
		super(id, entidad, idEntidad, idTipoContacto, detalle);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.entidad = row.entidad ?? "";
		this.idEntidad = row.idEntidad ?? 0;
		this.idTipoContacto = row.idTipoContacto ?? 0;
		this.detalle = row.detalle ?? "";
		this.state = row.state ?? "o";
	}

}
