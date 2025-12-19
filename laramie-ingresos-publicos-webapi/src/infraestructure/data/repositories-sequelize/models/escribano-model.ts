import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EscribanoSchema from './escribano-schema';

const sequelize = createConnection(true);

class EscribanoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("matricula")
	];

}

EscribanoModel.init(EscribanoSchema, {
  sequelize,
  modelName: 'Escribano',
  tableName: 'escribano',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EscribanoModel;
