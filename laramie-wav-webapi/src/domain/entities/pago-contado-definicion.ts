export default class PagoContadoDefinicion {

    id: number;
	idTipoPlanPago: number;
	codigo: string;
	descripcion: string;
	tieneQuita: boolean;
	aplicaTitular: boolean;
    aplicaResponsableCuenta: boolean;
	importeCapital: number;

	constructor(
        id: number = 0,
		idTipoPlanPago: number = 0,
		codigo: string = "",
		descripcion: string = "",
		tieneQuita: boolean = false,
		aplicaTitular: boolean = false,
        aplicaResponsableCuenta: boolean = false,
		importeCapital: number = 0
	)
	{
        this.id = id;
		this.idTipoPlanPago = idTipoPlanPago;
		this.codigo = codigo;
		this.descripcion = descripcion;
		this.tieneQuita = tieneQuita;
		this.aplicaTitular = aplicaTitular;
		this.aplicaResponsableCuenta = aplicaResponsableCuenta;
		this.importeCapital = importeCapital;
	}

	setFromObject = (row) =>
	{
		this.id = row.id ?? 0;
		this.idTipoPlanPago = row.idTipoPlanPago ?? 0;
		this.codigo = row.codigo ?? "";
		this.descripcion = row.descripcion ?? "";
		this.tieneQuita = row.tieneQuita ?? false;
		this.aplicaTitular = row.aplicaTitular ?? false;
		this.aplicaResponsableCuenta = row.aplicaResponsableCuenta ?? false;
		this.importeCapital = row.importeCapital ?? 0;
	}

}
