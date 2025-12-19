import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoDefinicionInteresSchema from './plan-pago-definicion-interes-schema';

const sequelize = createConnection(true);

class PlanPagoDefinicionInteresModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPlanPagoDefinicion"),
		this.getDataValue("cuotaDesde"),
		this.getDataValue("cuotaHasta"),
		parseFloat(this.getDataValue("porcentajeInteres"))
	];

}

PlanPagoDefinicionInteresModel.init(PlanPagoDefinicionInteresSchema, {
  sequelize,
  modelName: 'PlanPagoDefinicionInteres',
  tableName: 'plan_pago_definicion_interes',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoDefinicionInteresModel;
