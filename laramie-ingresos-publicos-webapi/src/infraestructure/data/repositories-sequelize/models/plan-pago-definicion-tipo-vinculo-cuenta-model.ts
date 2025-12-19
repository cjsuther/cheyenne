import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoDefinicionTipoVinculoCuentaSchema from './plan-pago-definicion-tipo-vinculo-cuenta-schema';

const sequelize = createConnection(true);

class PlanPagoDefinicionTipoVinculoCuentaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPlanPagoDefinicion"),
		this.getDataValue("idTipoVinculoCuenta")
	];

}

PlanPagoDefinicionTipoVinculoCuentaModel.init(PlanPagoDefinicionTipoVinculoCuentaSchema, {
  sequelize,
  modelName: 'PlanPagoDefinicionTipoVinculoCuenta',
  tableName: 'plan_pago_definicion_tipo_vinculo_cuenta',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoDefinicionTipoVinculoCuentaModel;
