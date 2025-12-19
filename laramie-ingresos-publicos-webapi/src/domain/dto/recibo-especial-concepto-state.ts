import ReciboEspecialConcepto from "../entities/recibo-especial-concepto";

export default class ReciboEspecialConceptoState extends ReciboEspecialConcepto {

	state: string;

	constructor(
        id: number = 0,
		idReciboEspecial: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		valor: number = 0,
		state: string = "o"
	)
	{
        super(
			id,	idReciboEspecial, idTasa, idSubTasa, valor
		);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idReciboEspecial = row.idReciboEspecial ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.valor = row.valor ?? 0;
		this.state = row.state ?? "o";
	}

}
