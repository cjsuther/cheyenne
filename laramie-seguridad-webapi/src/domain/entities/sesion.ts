export default class Sesion {

    id: number;
	token: string;
	fechaVencimiento: Date;
	fechaCreacion: Date;

	constructor(
        id: number = 0,
		token: string = "",
		fechaVencimiento: Date = null,
		fechaCreacion: Date = null
	)
	{
        this.id = id;
		this.token = token;
		this.fechaVencimiento = fechaVencimiento;
		this.fechaCreacion = fechaCreacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.token = row.token ?? "";
		this.fechaVencimiento = row.fechaVencimiento ?? null;
		this.fechaCreacion = row.fechaCreacion ?? null;
	}

}
