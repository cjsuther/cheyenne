import Direccion from "../entities/direccion";
import ZonaEntrega from "../entities/zona-entrega";

export default class ZonaEntregaState extends ZonaEntrega {

    state: string;
	direccion: Direccion;

	constructor(
        id: number = 0,
		idCuenta: number = 0,
		idTipoControlador: number = 0,
		email: string = "",
		state: string = "o",
		direccion: Direccion = null
	)
	{
        super(id, idCuenta, idTipoControlador, email);
		this.state = state;
		this.direccion = direccion;

	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTipoControlador = row.idTipoControlador ?? 0;
		this.email = row.email;
		this.state = row.state ?? "o";
		this.direccion = new Direccion();
		this.direccion.setFromObject(row.direccion);
	}

}
