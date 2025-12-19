import DeclaracionJuradaItem from "./declaracion-jurada-item";

export default class DeclaracionJurada {

    id: number;
	idModeloDeclaracionJurada: number;
	descModeloDeclaracionJurada: string;
	fechaPresentacionDeclaracionJurada: Date;
	anioDeclaracion: string;
	mesDeclaracion: number;
	numero: string;
	declaracionJuradaItems: Array<DeclaracionJuradaItem>;

	constructor(
        id: number = 0,
		idModeloDeclaracionJurada: number = 0,
		descModeloDeclaracionJurada: string = "",
		fechaPresentacionDeclaracionJurada: Date = null,
		anioDeclaracion: string = "",
		mesDeclaracion: number = 0,
		numero: string = "",
        declaracionJuradaItems: Array<DeclaracionJuradaItem> = []
	)
	{
        this.id = id;
		this.idModeloDeclaracionJurada = idModeloDeclaracionJurada;
		this.descModeloDeclaracionJurada = descModeloDeclaracionJurada;
		this.fechaPresentacionDeclaracionJurada = fechaPresentacionDeclaracionJurada;
		this.anioDeclaracion = anioDeclaracion;
		this.mesDeclaracion = mesDeclaracion;
		this.numero = numero;
		this.declaracionJuradaItems = declaracionJuradaItems;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idModeloDeclaracionJurada = row.idModeloDeclaracionJurada ?? 0;
		this.descModeloDeclaracionJurada = row.descModeloDeclaracionJurada ?? "";
		this.fechaPresentacionDeclaracionJurada = row.fechaPresentacionDeclaracionJurada ?? null;
		this.anioDeclaracion = row.anioDeclaracion ?? "";
		this.mesDeclaracion = row.mesDeclaracion ?? 0;
		this.numero = row.numero ?? "";
		this.declaracionJuradaItems = row.declaracionJuradaItems.map(x => {
            let item = new DeclaracionJuradaItem();
            item.setFromObject(x);
            return item;
        });
	}

}
