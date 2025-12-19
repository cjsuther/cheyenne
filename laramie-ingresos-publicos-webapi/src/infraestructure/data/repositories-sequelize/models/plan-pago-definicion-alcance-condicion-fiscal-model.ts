import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoDefinicionAlcanceCondicionFiscalSchema from './plan-pago-definicion-alcance-condicion-fiscal-schema';

const sequelize = createConnection(true);

class PlanPagoDefinicionAlcanceCondicionFiscalModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPlanPagoDefinicion"),
		this.getDataValue("idCondicionFiscal")
	];

}

PlanPagoDefinicionAlcanceCondicionFiscalModel.init(PlanPagoDefinicionAlcanceCondicionFiscalSchema, {
  sequelize,
  modelName: 'PlanPagoDefinicionAlcanceCondicionFiscal',
  tableName: 'plan_pago_definicion_alcance_condicion_fiscal',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoDefinicionAlcanceCondicionFiscalModel;
