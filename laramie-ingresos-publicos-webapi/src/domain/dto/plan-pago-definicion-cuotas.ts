import PlanPagoDefinicion from "../entities/plan-pago-definicion";
import PlanPagoDefinicionTipoVinculoCuenta from "../entities/plan-pago-definicion-tipo-vinculo-cuenta";
import OpcionCuota from "./opcion-cuota";

export default class PlanPagoDefinicionCuotas {

    planPagoDefinicion: PlanPagoDefinicion;
    opcionCuotas: Array<OpcionCuota>;
    tiposVinculoCuenta: Array<PlanPagoDefinicionTipoVinculoCuenta>;


    constructor(planPagoDefinicion: PlanPagoDefinicion = null, opcionCuotas: Array<OpcionCuota> = [],
                tiposVinculoCuenta: Array<PlanPagoDefinicionTipoVinculoCuenta> = [])
    {
        this.planPagoDefinicion = planPagoDefinicion;
        this.opcionCuotas = opcionCuotas;
        this.tiposVinculoCuenta = tiposVinculoCuenta;
    }

}