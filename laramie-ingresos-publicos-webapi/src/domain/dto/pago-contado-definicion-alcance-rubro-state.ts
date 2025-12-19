import PagoContadoDefinicionAlcanceRubro from "../entities/pago-contado-definicion-alcance-rubro";

export default class PagoContadoDefinicionAlcanceRubroState extends PagoContadoDefinicionAlcanceRubro  {

    state: string;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idRubro: number = 0,
        state: string = "o"
	)
	{
        super(id, idPagoContadoDefinicion, idRubro);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idRubro = row.idRubro ?? 0;
        this.state = row.state ?? "o";
	}

}
