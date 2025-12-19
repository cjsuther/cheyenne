import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import RubroBCRASchema from './rubro-bcra-schema';

const sequelize = createConnection(true);

class RubroBCRAModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

RubroBCRAModel.init(RubroBCRASchema, {
  sequelize,
  modelName: 'RubroBCRA',
  tableName: 'rubro_bcra',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default RubroBCRAModel;
