import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoVencimientoPlanPagoSchema from './tipo-vencimiento-plan-pago-schema';

const sequelize = createConnection(true);

class TipoVencimientoPlanPagoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("descripcion"),
		this.getDataValue("baseDiaActual"),
		this.getDataValue("baseDiaFinMes"),
		this.getDataValue("habiles"),
		this.getDataValue("proximoHabil"),
		this.getDataValue("anteriorHabil"),
		this.getDataValue("dias"),
		this.getDataValue("meses")
	];

}

TipoVencimientoPlanPagoModel.init(TipoVencimientoPlanPagoSchema, {
  sequelize,
  modelName: 'TipoVencimientoPlanPago',
  tableName: 'tipo_vencimiento_plan_pago',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoVencimientoPlanPagoModel;
