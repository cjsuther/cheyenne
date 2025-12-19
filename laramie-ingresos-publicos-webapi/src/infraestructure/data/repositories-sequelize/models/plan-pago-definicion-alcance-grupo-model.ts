import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoDefinicionAlcanceGrupoSchema from './plan-pago-definicion-alcance-grupo-schema';

const sequelize = createConnection(true);

class PlanPagoDefinicionAlcanceGrupoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPlanPagoDefinicion"),
		this.getDataValue("idGrupo")
	];

}

PlanPagoDefinicionAlcanceGrupoModel.init(PlanPagoDefinicionAlcanceGrupoSchema, {
  sequelize,
  modelName: 'PlanPagoDefinicionAlcanceGrupo',
  tableName: 'plan_pago_definicion_alcance_grupo',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoDefinicionAlcanceGrupoModel;
