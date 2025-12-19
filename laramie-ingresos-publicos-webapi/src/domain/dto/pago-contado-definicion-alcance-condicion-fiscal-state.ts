import PagoContadoDefinicionAlcanceCondicionFiscal from "../entities/pago-contado-definicion-alcance-condicion-fiscal";

export default class PagoContadoDefinicionAlcanceCondicionFiscalState extends PagoContadoDefinicionAlcanceCondicionFiscal  {

    state: string;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idCondicionFiscal: number = 0,
        state: string = "o"
	)
	{
        super(id, idPagoContadoDefinicion, idCondicionFiscal);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idCondicionFiscal = row.idCondicionFiscal ?? 0;
        this.state = row.state ?? "o";
	}

}
