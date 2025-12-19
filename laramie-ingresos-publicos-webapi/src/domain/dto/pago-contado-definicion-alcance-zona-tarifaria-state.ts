import PagoContadoDefinicionAlcanceZonaTarifaria from "../entities/pago-contado-definicion-alcance-zona-tarifaria";

export default class PagoContadoDefinicionAlcanceZonaTarifariaState extends PagoContadoDefinicionAlcanceZonaTarifaria  {


    state: string;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idZonaTarifaria: number = 0,
        state: string = "o"
	)
	{
        super(id, idPagoContadoDefinicion, idZonaTarifaria);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idZonaTarifaria = row.idZonaTarifaria ?? 0;
        this.state = row.state ?? "o";
	}

}
