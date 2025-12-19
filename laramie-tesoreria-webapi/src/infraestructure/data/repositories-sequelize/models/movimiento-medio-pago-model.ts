import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import { hooksConfig } from './hooks-model';
import MovimientoMedioPagoSchema from './movimiento-medio-pago-schema';

const sequelize = createConnection(true);

class MovimientoMedioPagoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idMovimientoCaja"),
		this.getDataValue("idMedioPago"),
		this.getDataValue("numeroMedioPago"),
		this.getDataValue("bancoMedioPago"),
		parseFloat(this.getDataValue("importeCobro"))
	];

}

MovimientoMedioPagoModel.init(MovimientoMedioPagoSchema, {
  sequelize,
  hooks: hooksConfig,
  modelName: 'MovimientoMedioPago',
  tableName: 'movimiento_medio_pago',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default MovimientoMedioPagoModel;
