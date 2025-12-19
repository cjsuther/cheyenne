import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoCuotaSchema from './plan-pago-cuota-schema';

const sequelize = createConnection(true);

class PlanPagoCuotaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPlanPago"),
		this.getDataValue("idEstadoPlanPagoCuota"),
		this.getDataValue("esAnticipo"),
		this.getDataValue("numero"),
		parseFloat(this.getDataValue("importeCapital")),
		parseFloat(this.getDataValue("importeIntereses")),
		parseFloat(this.getDataValue("importeSellados")),
		parseFloat(this.getDataValue("importeGastosCausidicos")),
		parseFloat(this.getDataValue("importeCuota")),
		this.getDataValue("fechaVencimiento"),
		this.getDataValue("fechaPagado")
	];

}

PlanPagoCuotaModel.init(PlanPagoCuotaSchema, {
  sequelize,
  modelName: 'PlanPagoCuota',
  tableName: 'plan_pago_cuota',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoCuotaModel;
