import ReciboEspecial from "../entities/recibo-especial";
import ReciboEspecialConceptoState from "./recibo-especial-concepto-state";

export default class ReciboEspecialDTO {

    reciboEspecial?: ReciboEspecial;
	recibosEspecialConcepto: Array<ReciboEspecialConceptoState>;

	constructor(
        reciboEspecial: ReciboEspecial = new ReciboEspecial(),
        recibosEspecialConcepto: Array<ReciboEspecialConceptoState> = []
	)
	{
        this.reciboEspecial = reciboEspecial;
		this.recibosEspecialConcepto = recibosEspecialConcepto;
	}

	setFromObject = (row) =>
	{
        this.reciboEspecial.setFromObject(row.reciboEspecial);
		this.recibosEspecialConcepto = row.recibosEspecialConcepto.map(x => {
            let item = new ReciboEspecialConceptoState();
            item.setFromObject(x);
            return item;
        });
	}

}
