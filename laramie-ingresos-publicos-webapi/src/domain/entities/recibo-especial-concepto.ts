export default class ReciboEspecialConcepto {

    id: number;
	idReciboEspecial: number;
	idTasa: number;
	idSubTasa: number;
	valor: number;

	constructor(
        id: number = 0,
		idReciboEspecial: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		valor: number = 0
	)
	{
        this.id = id;
		this.idReciboEspecial = idReciboEspecial;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.valor = valor;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idReciboEspecial = row.idReciboEspecial ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.valor = row.valor  ?? 0;
	}

}
