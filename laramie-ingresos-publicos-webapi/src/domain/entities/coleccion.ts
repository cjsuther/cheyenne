import ColeccionCampo from "./coleccion-campo";

export default class Coleccion {

    id: number;
	idTipoTributo: number;
	nombre: string;
	descripcion: string;
	ejecucion: string;
	coleccionesCampo: Array<ColeccionCampo>;

	constructor(
        id: number = 0,
		idTipoTributo: number = 0,
		nombre: string = "",
		descripcion: string = "",
		ejecucion: string = "",
		coleccionesCampo: Array<ColeccionCampo> = []
	)
	{
        this.id = id;
		this.idTipoTributo = idTipoTributo;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.ejecucion = ejecucion;
		this.coleccionesCampo = coleccionesCampo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.nombre = row.nombre ?? "";
		this.descripcion = row.descripcion ?? "";
		this.ejecucion = row.ejecucion ?? "";
		this.coleccionesCampo = row.coleccionesCampo.map(x => {
            let item = new ColeccionCampo();
            item.setFromObject(x);
            return item;
        });
	}

}
