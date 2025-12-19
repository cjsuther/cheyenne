export default class DeclaracionJuradaItem {

	id: number;
	idClaseDeclaracionJurada: number;
	idRubro: number;
	idTipoDeclaracionJurada: number;
	valor: number;

	constructor(
		id: number = 0,
		idClaseDeclaracionJurada: number = 0,
		idRubro: number = 0,
		idTipoDeclaracionJurada: number = 0,
		valor: number = 0
	)
	{
        this.id = id;
		this.idClaseDeclaracionJurada = idClaseDeclaracionJurada;
		this.idRubro = idRubro;
		this.idTipoDeclaracionJurada = idTipoDeclaracionJurada;
		this.valor = valor;
	}

	setFromObject = (row) =>
	{
		this.id = row.id ?? 0;
		this.idClaseDeclaracionJurada = row.idClaseDeclaracionJurada ?? 0;
		this.idRubro = row.idRubro ?? 0;
		this.idTipoDeclaracionJurada = row.idTipoDeclaracionJurada ?? 0;
		this.valor = row.valor ?? 0;
	}

}
