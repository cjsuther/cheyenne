import PagoContadoDefinicionAlcanceFormaJuridica from "../entities/pago-contado-definicion-alcance-forma-juridica";

export default class PagoContadoDefinicionAlcanceFormaJuridicaState extends PagoContadoDefinicionAlcanceFormaJuridica  {

    state: string;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idFormaJuridica: number = 0,
        state: string = "o"
	)
	{
        super(id, idPagoContadoDefinicion, idFormaJuridica);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idFormaJuridica = row.idFormaJuridica ?? 0;
        this.state = row.state ?? "o";
	}

}
