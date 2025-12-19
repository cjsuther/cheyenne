import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PaisSchema from './pais-schema';

const sequelize = createConnection(true);

class PaisModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

PaisModel.init(PaisSchema, {
  sequelize,
  modelName: 'Pais',
  tableName: 'pais',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PaisModel;
