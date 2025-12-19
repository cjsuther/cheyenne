import { precisionRound } from "../../infraestructure/sdk/utils/convert";

export default class OpcionCuota {

    cantidadCuotas: number;
    importeCapital: number;
    importeQuita: number;
    importeIntereses: number;
    importeAnticipo: number;
    importeCuota: number;
    importePlanPago: number;

    constructor(cantidadCuotas: number = 0, importeCapital: number = 0, importeQuita: number = 0, importeIntereses: number = 0,
                importeAnticipo: number = 0, importeCuota: number = 0, importePlanPago = 0)
    {
        this.cantidadCuotas = cantidadCuotas;
        this.importeCapital = precisionRound(importeCapital);
        this.importeQuita = precisionRound(importeQuita);
        this.importeIntereses = precisionRound(importeIntereses);
        this.importeAnticipo = precisionRound(importeAnticipo);
        this.importeCuota = precisionRound(importeCuota);
        this.importePlanPago = precisionRound(importePlanPago);
    }

    setFromObject = (row) =>
	{
		this.cantidadCuotas = row.cantidadCuotas ?? 0;
        this.importeCapital = precisionRound(row.importeCapital ?? 0);
        this.importeQuita = precisionRound(row.importeQuita ?? 0);
        this.importeIntereses = precisionRound(row.importeIntereses ?? 0);
		this.importeAnticipo = precisionRound(row.importeAnticipo ?? 0);
        this.importeCuota = precisionRound(row.importeCuota ?? 0);
		this.importePlanPago = precisionRound(row.importePlanPago ?? 0);
	}

}