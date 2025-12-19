import PagoContadoDefinicionAlcanceRubroAfip from "../entities/pago-contado-definicion-alcance-rubro-afip";

export default class PagoContadoDefinicionAlcanceRubroAfipState extends PagoContadoDefinicionAlcanceRubroAfip  {

    state: string;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idRubroAfip: number = 0,
        state: string = "o"
	)
	{
        super(id, idPagoContadoDefinicion, idRubroAfip);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idRubroAfip = row.idRubroAfip ?? 0;
        this.state = row.state ?? "o";
	}

}
