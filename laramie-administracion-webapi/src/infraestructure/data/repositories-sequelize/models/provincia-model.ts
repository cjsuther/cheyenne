import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ProvinciaSchema from './provincia-schema';

const sequelize = createConnection(true);

class ProvinciaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("idPais")
	];

}

ProvinciaModel.init(ProvinciaSchema, {
  sequelize,
  modelName: 'Provincia',
  tableName: 'provincia',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ProvinciaModel;
