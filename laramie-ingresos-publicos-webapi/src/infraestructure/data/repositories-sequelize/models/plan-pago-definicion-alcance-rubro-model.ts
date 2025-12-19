import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoDefinicionAlcanceRubroSchema from './plan-pago-definicion-alcance-rubro-schema';

const sequelize = createConnection(true);

class PlanPagoDefinicionAlcanceRubroModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPlanPagoDefinicion"),
		this.getDataValue("idRubro")
	];

}

PlanPagoDefinicionAlcanceRubroModel.init(PlanPagoDefinicionAlcanceRubroSchema, {
  sequelize,
  modelName: 'PlanPagoDefinicionAlcanceRubro',
  tableName: 'plan_pago_definicion_alcance_rubro',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoDefinicionAlcanceRubroModel;
