import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoDefinicionAlcanceTasaSchema from './plan-pago-definicion-alcance-tasa-schema';

const sequelize = createConnection(true);

class PlanPagoDefinicionAlcanceTasaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPlanPagoDefinicion"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa")
	];

}

PlanPagoDefinicionAlcanceTasaModel.init(PlanPagoDefinicionAlcanceTasaSchema, {
  sequelize,
  modelName: 'PlanPagoDefinicionAlcanceTasa',
  tableName: 'plan_pago_definicion_alcance_tasa',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoDefinicionAlcanceTasaModel;
