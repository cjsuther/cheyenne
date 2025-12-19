import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoDefinicionAlcanceRubroAfipSchema from './plan-pago-definicion-alcance-rubro-afip-schema';

const sequelize = createConnection(true);

class PlanPagoDefinicionAlcanceRubroAfipModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPlanPagoDefinicion"),
		this.getDataValue("idRubroAfip")
	];

}

PlanPagoDefinicionAlcanceRubroAfipModel.init(PlanPagoDefinicionAlcanceRubroAfipSchema, {
  sequelize,
  modelName: 'PlanPagoDefinicionAlcanceRubroAfip',
  tableName: 'plan_pago_definicion_alcance_rubro_afip',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoDefinicionAlcanceRubroAfipModel;
