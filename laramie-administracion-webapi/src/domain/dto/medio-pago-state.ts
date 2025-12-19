import MedioPago from '../entities/medio-pago';

export default class MedioPagoState extends MedioPago {

    state: string;

	constructor(
        id: number = 0,
		idTipoPersona: number = 0,
		idPersona: number = 0,
		idTipoMedioPago: number = 0,
		titular: string = "",
		numero: string = "",
		banco: string = "",
		alias: string = "",
		idTipoTarjeta: number = 0,
		idMarcaTarjeta: number = 0,
		fechaVencimiento: Date = null,
		cvv: string = "",
		state: string = "o"
	)
	{
		super(id, idTipoPersona, idPersona, idTipoMedioPago, titular, numero, banco, alias, idTipoTarjeta, idMarcaTarjeta, fechaVencimiento, cvv);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoMedioPago = row.idTipoMedioPago ?? 0;
		this.titular = row.titular ?? "";
		this.numero = row.numero ?? "";
		this.banco = row.banco ?? "";
		this.alias = row.alias ?? "";
		this.idTipoTarjeta = row.idTipoTarjeta ?? 0;
		this.idMarcaTarjeta = row.idMarcaTarjeta ?? 0;
		this.fechaVencimiento = row.fechaVencimiento ?? null;
		this.cvv = row.cvv ?? "";
		this.state = row.state ?? "o";
	}

}
