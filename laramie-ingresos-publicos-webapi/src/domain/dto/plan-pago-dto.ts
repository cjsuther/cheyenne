import PlanPagoDefinicion from '../entities/plan-pago-definicion';
import PlanPago from '../entities/plan-pago';
import PlanPagoCuota from '../entities/plan-pago-cuota';
import TipoPlanPago from '../entities/tipo-plan-pago';


export default class PlanPagoDTO {

    tipoPlanPago?: TipoPlanPago;
    planPagoDefinicion?: PlanPagoDefinicion;
    planPago?: PlanPago;
    planPagoCuotas: Array<PlanPagoCuota>;

    constructor(
        tipoPlanPago: TipoPlanPago = new TipoPlanPago(),
        planPagoDefinicion: PlanPagoDefinicion = new PlanPagoDefinicion(),
        planPago: PlanPago = new PlanPago(),
        planPagoCuotas: Array<PlanPagoCuota> = [])
    {
        this.tipoPlanPago = tipoPlanPago;
        this.planPagoDefinicion = planPagoDefinicion;
        this.planPago = planPago;
        this.planPagoCuotas = planPagoCuotas;
    }

    setFromObject = (row) =>
    {
        this.tipoPlanPago.setFromObject(row.tipoPlanPago);
        this.planPagoDefinicion.setFromObject(row.planPagoDefinicion);
        this.planPago.setFromObject(row.planPago);
        this.planPagoCuotas = row.planPagoCuotas.map(x => {
            let item = new PlanPagoCuota();
            item.setFromObject(x);
            return item;
        });
    }

}
