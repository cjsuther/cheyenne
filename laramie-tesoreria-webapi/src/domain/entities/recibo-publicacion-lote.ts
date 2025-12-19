import ReciboPublicacion from "./recibo-publicacion";

export default class ReciboPublicacionLote {

    id: number;
	numeroLote: string;
	fechaLote: Date;
	casos: number;
	importeTotal1: number;
	importeTotal2: number;

	recibosPublicacion: ReciboPublicacion[];

	constructor(
        id: number = 0,
		numeroLote: string = "",
		fechaLote: Date = null,
		casos: number = 0,
		importeTotal1: number = 0,
		importeTotal2: number = 0
	)
	{
        this.id = id;
		this.numeroLote = numeroLote;
		this.fechaLote = fechaLote;
		this.casos = casos;
		this.importeTotal1 = importeTotal1;
		this.importeTotal2 = importeTotal2;
		this.recibosPublicacion = [];
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? null;
		this.numeroLote = row.numeroLote ?? "";
		this.fechaLote = row.fechaLote ?? null;
		this.casos = row.casos ?? 0;
		this.importeTotal1 = row.importeTotal1 ?? 0;
		this.importeTotal2 = row.importeTotal2 ?? 0;
		this.recibosPublicacion = row.recibosPublicacion.map(x => {
            let item = new ReciboPublicacion();
            item.setFromObject(x);
            return item;
        });
	}

	setFromObjectAddReciboPublicacion = (row) =>
	{
        this.id = row.id ?? null;
		this.numeroLote = row.numeroLotePublicacion ?? "";
		this.fechaLote = row.fechaPublicacion ? new Date(row.fechaPublicacion) : null;
		this.casos = 0;
		this.importeTotal1 = 0;
		this.importeTotal2 = 0;
		this.recibosPublicacion = row.recibosPublicacion.map(x => {
            let item = new ReciboPublicacion();
            item.setFromObject(x);
			this.importeTotal1 += item.importeVencimiento1;
			this.importeTotal2 += item.importeVencimiento2;
			this.casos++;
            return item;
        });
	}

}
