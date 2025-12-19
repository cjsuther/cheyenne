import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ZonaGeoreferenciaSchema from './zona-georeferencia-schema';

const sequelize = createConnection(true);

class ZonaGeoreferenciaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("idLocalidad"),
		this.getDataValue("longitud"),
		this.getDataValue("latitud")
	];

}

ZonaGeoreferenciaModel.init(ZonaGeoreferenciaSchema, {
  sequelize,
  modelName: 'ZonaGeoreferencia',
  tableName: 'zona_georeferencia',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ZonaGeoreferenciaModel;
