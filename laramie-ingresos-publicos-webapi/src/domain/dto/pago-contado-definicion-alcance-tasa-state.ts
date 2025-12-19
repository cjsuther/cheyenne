import PagoContadoDefinicionAlcanceTasa from "../entities/pago-contado-definicion-alcance-tasa";

export default class PagoContadoDefinicionAlcanceTasaState extends PagoContadoDefinicionAlcanceTasa  {

    state: string;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
        state: string = "o"
	)
	{
        super(id, idPagoContadoDefinicion, idTasa, idSubTasa);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
        this.state = row.state ?? "o";
	}

}
