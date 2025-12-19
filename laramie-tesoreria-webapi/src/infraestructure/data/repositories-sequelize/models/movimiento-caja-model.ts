import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import { hooksConfig } from './hooks-model';
import MovimientoCajaSchema from './movimiento-caja-schema';

const sequelize = createConnection(true);

class MovimientoCajaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCaja"),
		this.getDataValue("idCajaAsignacion"),
		this.getDataValue("idTipoMovimientoCaja"),
		parseFloat(this.getDataValue("importeCobro")),
		this.getDataValue("fechaCobro"),
		this.getDataValue("observacion")
	];

}

MovimientoCajaModel.init(MovimientoCajaSchema, {
  sequelize,
  hooks: hooksConfig,
  modelName: 'MovimientoCaja',
  tableName: 'movimiento_caja',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default MovimientoCajaModel;
