export default class Tasa {

    id: number;
	codigo: string;
	idTipoTributo: number;
	idCategoriaTasa: number;
	descripcion: string;
	porcentajeDescuento: number;

	constructor(
        id: number = 0,
		codigo: string = "",
		idTipoTributo: number = 0,
		idCategoriaTasa: number = 0,
		descripcion: string = "",
		porcentajeDescuento: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.idTipoTributo = idTipoTributo;
		this.idCategoriaTasa = idCategoriaTasa;
		this.descripcion = descripcion;
		this.porcentajeDescuento = porcentajeDescuento;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.idCategoriaTasa = row.idCategoriaTasa ?? 0;
		this.descripcion = row.descripcion ?? "";
		this.porcentajeDescuento = row.porcentajeDescuento ?? 0;
	}

}
