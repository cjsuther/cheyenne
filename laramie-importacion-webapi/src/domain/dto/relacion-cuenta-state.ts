import RelacionCuenta from "../entities/relacion-cuenta";

export default class RelacionCuentaState extends RelacionCuenta {

    state: string;

	constructor(
        id: number = 0,
		idCuenta1: number = 0,
		idCuenta2: number = 0,
		state: string = "o"
	)
	{
        super(id, idCuenta1, idCuenta2);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta1 = row.idCuenta1 ?? 0;
		this.idCuenta2 = row.idCuenta2 ?? 0;
		this.state = row.state ?? "o";
	}

}
