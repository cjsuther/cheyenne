import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoMovimientoSchema from './tipo-movimiento-schema';

const sequelize = createConnection(true);

class TipoMovimientoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("actEmitido"),
		this.getDataValue("automatico"),
		this.getDataValue("autonumerado"),
		this.getDataValue("numero"),
		this.getDataValue("imputacion"),
		this.getDataValue("tipo")
	];

}

TipoMovimientoModel.init(TipoMovimientoSchema, {
  sequelize,
  modelName: 'TipoMovimiento',
  tableName: 'tipo_movimiento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoMovimientoModel;
