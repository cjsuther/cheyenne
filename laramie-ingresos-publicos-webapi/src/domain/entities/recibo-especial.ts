import ReciboEspecialConcepto from "./recibo-especial-concepto";

export default class ReciboEspecial {

    id: number;
	codigo: string;
	descripcion: string;
	aplicaValorUF: boolean;
	recibosEspecialConcepto: Array<ReciboEspecialConcepto>;

	constructor(
        id: number = 0,
		codigo: string = "",
		descripcion: string = "",
		aplicaValorUF: boolean = false,
		recibosEspecialConcepto: Array<ReciboEspecialConcepto> = []
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.descripcion = descripcion;
		this.aplicaValorUF = aplicaValorUF;
		this.recibosEspecialConcepto = recibosEspecialConcepto;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.descripcion = row.descripcion ?? "";
		this.aplicaValorUF = row.aplicaValorUF ?? false;
		this.recibosEspecialConcepto = row.recibosEspecialConcepto??[].map(x => {
            let item = new ReciboEspecialConcepto();
            item.setFromObject(x);
            return item;
        });
	}

}
