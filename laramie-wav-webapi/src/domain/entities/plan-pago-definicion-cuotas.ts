import OpcionCuota from "./opcion-cuota";
import PlanPagoDefinicion from "./plan-pago-definicion";

export default class PlanPagoDefinicionCuotas {

    planPagoDefinicion: PlanPagoDefinicion;
    opcionCuotas: Array<OpcionCuota>;


    constructor()
    {
        this.planPagoDefinicion = new PlanPagoDefinicion();
        this.opcionCuotas = [];
    }

}