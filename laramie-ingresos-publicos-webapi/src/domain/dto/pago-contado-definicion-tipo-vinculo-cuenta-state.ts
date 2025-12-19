import PagoContadoDefinicionTipoVinculoCuenta from "../entities/pago-contado-definicion-tipo-vinculo-cuenta";

export default class PagoContadoDefinicionTipoVinculoCuentaState extends PagoContadoDefinicionTipoVinculoCuenta  {

    state: string;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idTipoVinculoCuenta: number = 0,
        state: string = "o"
	)
	{
        super(id, idPagoContadoDefinicion, idTipoVinculoCuenta);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idTipoVinculoCuenta = row.idTipoVinculoCuenta ?? 0;
        this.state = row.state ?? "o";
	}

}
