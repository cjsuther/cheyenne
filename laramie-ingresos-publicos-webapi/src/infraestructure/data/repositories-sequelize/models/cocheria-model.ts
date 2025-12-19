import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CocheriaSchema from './cocheria-schema';

const sequelize = createConnection(true);

class CocheriaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

CocheriaModel.init(CocheriaSchema, {
  sequelize,
  modelName: 'Cocheria',
  tableName: 'cocheria',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CocheriaModel;
