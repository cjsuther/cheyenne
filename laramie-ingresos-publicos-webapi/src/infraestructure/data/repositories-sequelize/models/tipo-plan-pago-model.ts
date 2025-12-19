import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PagoContadoDefinicionModel from './pago-contado-definicion-model';
import PlanPagoDefinicionModel from './plan-pago-definicion-model';
import PlanPagoModel from './plan-pago-model';
import TipoPlanPagoSchema from './tipo-plan-pago-schema';

const sequelize = createConnection(true);

class TipoPlanPagoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("convenio"),
		this.getDataValue("condiciones")
	];

}

TipoPlanPagoModel.init(TipoPlanPagoSchema, {
  sequelize,
  modelName: 'TipoPlanPago',
  tableName: 'tipo_plan_pago',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

TipoPlanPagoModel.hasMany(PagoContadoDefinicionModel, { as: 'pagoContadoDefinicion', foreignKey: 'idTipoPlanPago' });
PagoContadoDefinicionModel.belongsTo(TipoPlanPagoModel, { as: 'tipoPlanPago', foreignKey: 'idTipoPlanPago' });

TipoPlanPagoModel.hasMany(PlanPagoDefinicionModel, { as: 'planPagoDefinicion', foreignKey: 'idTipoPlanPago' });
PlanPagoDefinicionModel.belongsTo(TipoPlanPagoModel, { as: 'tipoPlanPago', foreignKey: 'idTipoPlanPago' });

TipoPlanPagoModel.hasMany(PlanPagoModel, { as: 'planPago', foreignKey: 'idTipoPlanPago' });
PlanPagoModel.belongsTo(TipoPlanPagoModel, { as: 'tipoPlanPago', foreignKey: 'idTipoPlanPago' });

export default TipoPlanPagoModel;
