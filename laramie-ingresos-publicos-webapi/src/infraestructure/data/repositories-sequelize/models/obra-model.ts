import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ObraSchema from './obra-schema';

const sequelize = createConnection(true);

class ObraModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		parseFloat(this.getDataValue("importe"))
	];

}

ObraModel.init(ObraSchema, {
  sequelize,
  modelName: 'Obra',
  tableName: 'obra',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ObraModel;
