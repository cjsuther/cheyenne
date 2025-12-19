import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoDefinicionQuitaCuotaSchema from './plan-pago-definicion-quita-cuota-schema';

const sequelize = createConnection(true);

class PlanPagoDefinicionQuitaCuotaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPlanPagoDefinicion"),
		this.getDataValue("cuotaDesde"),
		this.getDataValue("cuotaHasta"),
		parseFloat(this.getDataValue("porcentajeQuitaRecargos")),
		parseFloat(this.getDataValue("porcentajeQuitaMultaInfracciones")),
		parseFloat(this.getDataValue("porcentajeQuitaHonorarios")),
		parseFloat(this.getDataValue("porcentajeQuitaAportes"))
	];

}

PlanPagoDefinicionQuitaCuotaModel.init(PlanPagoDefinicionQuitaCuotaSchema, {
  sequelize,
  modelName: 'PlanPagoDefinicionQuitaCuota',
  tableName: 'plan_pago_definicion_quita_cuota',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoDefinicionQuitaCuotaModel;
