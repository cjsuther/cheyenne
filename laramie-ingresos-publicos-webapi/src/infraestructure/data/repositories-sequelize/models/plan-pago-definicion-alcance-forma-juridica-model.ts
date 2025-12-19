import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoDefinicionAlcanceFormaJuridicaSchema from './plan-pago-definicion-alcance-forma-juridica-schema';

const sequelize = createConnection(true);

class PlanPagoDefinicionAlcanceFormaJuridicaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPlanPagoDefinicion"),
		this.getDataValue("idFormaJuridica")
	];

}

PlanPagoDefinicionAlcanceFormaJuridicaModel.init(PlanPagoDefinicionAlcanceFormaJuridicaSchema, {
  sequelize,
  modelName: 'PlanPagoDefinicionAlcanceFormaJuridica',
  tableName: 'plan_pago_definicion_alcance_forma_juridica',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoDefinicionAlcanceFormaJuridicaModel;
