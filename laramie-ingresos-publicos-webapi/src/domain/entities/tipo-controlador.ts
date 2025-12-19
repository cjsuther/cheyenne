export default class TipoControlador {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	esSupervisor: boolean;
	email: boolean;
	direccion: boolean;
	abogado: boolean;
	oficialJusticia: boolean;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		esSupervisor: boolean = false,
		email: boolean = false,
		direccion: boolean = false,
		abogado: boolean = false,
		oficialJusticia: boolean = false
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.esSupervisor = esSupervisor;
		this.email = email;
		this.direccion = direccion;
		this.abogado = abogado,
		this.oficialJusticia = oficialJusticia
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.esSupervisor = row.esSupervisor ?? false;
		this.email = row.email ?? false;
		this.direccion = row.direccion ?? false;
		this.abogado = row.abogado ?? false;
		this.oficialJusticia = row.oficialJusticia ?? false;
	}

}
