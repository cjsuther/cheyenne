import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import MotivoBajaRubroComercioSchema from './motivo-baja-rubro-comercio-schema';

const sequelize = createConnection(true);

class MotivoBajaRubroComercioModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("bajaConDeuda"),
		this.getDataValue("bajaCancelaDeuda")
	];

}

MotivoBajaRubroComercioModel.init(MotivoBajaRubroComercioSchema, {
  sequelize,
  modelName: 'MotivoBajaRubroComercio',
  tableName: 'motivo_baja_rubro_comercio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default MotivoBajaRubroComercioModel;
