import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import MotivoBajaComercioSchema from './motivo-baja-comercio-schema';

const sequelize = createConnection(true);

class MotivoBajaComercioModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("bajaConDeuda"),
		this.getDataValue("bajaCancelaDeuda")
	];

}

MotivoBajaComercioModel.init(MotivoBajaComercioSchema, {
  sequelize,
  modelName: 'MotivoBajaComercio',
  tableName: 'motivo_baja_comercio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default MotivoBajaComercioModel;
