import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import RubroProvinciaSchema from './rubro-provincia-schema';

const sequelize = createConnection(true);

class RubroProvinciaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

RubroProvinciaModel.init(RubroProvinciaSchema, {
  sequelize,
  modelName: 'RubroProvincia',
  tableName: 'rubro_provincia',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default RubroProvinciaModel;
