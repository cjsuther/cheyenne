export default class RelacionCuenta {

    id: number;
	idCuenta1: number;
	idCuenta2: number;

	constructor(
        id: number = 0,
		idCuenta1: number = 0,
		idCuenta2: number = 0
	)
	{
        this.id = id;
		this.idCuenta1 = idCuenta1;
		this.idCuenta2 = idCuenta2;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta1 = row.idCuenta1 ?? 0;
		this.idCuenta2 = row.idCuenta2 ?? 0;
	}

}
