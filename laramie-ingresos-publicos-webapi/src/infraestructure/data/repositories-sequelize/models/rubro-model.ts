import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import RubroSchema from './rubro-schema';

const sequelize = createConnection(true);

class RubroModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

RubroModel.init(RubroSchema, {
  sequelize,
  modelName: 'Rubro',
  tableName: 'rubro',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default RubroModel;
