import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoDefinicionAlcanceZonaTarifariaSchema from './plan-pago-definicion-alcance-zona-tarifaria-schema';

const sequelize = createConnection(true);

class PlanPagoDefinicionAlcanceZonaTarifariaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPlanPagoDefinicion"),
		this.getDataValue("idZonaTarifaria")
	];

}

PlanPagoDefinicionAlcanceZonaTarifariaModel.init(PlanPagoDefinicionAlcanceZonaTarifariaSchema, {
  sequelize,
  modelName: 'PlanPagoDefinicionAlcanceZonaTarifaria',
  tableName: 'plan_pago_definicion_alcance_zona_tarifaria',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoDefinicionAlcanceZonaTarifariaModel;
