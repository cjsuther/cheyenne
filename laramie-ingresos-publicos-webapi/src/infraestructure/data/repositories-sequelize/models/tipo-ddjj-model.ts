import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoDDJJSchema from './tipo-ddjj-schema';

const sequelize = createConnection(true);

class TipoDDJJModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("automatico")
	];

}

TipoDDJJModel.init(TipoDDJJSchema, {
  sequelize,
  modelName: 'TipoDDJJ',
  tableName: 'tipo_ddjj',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoDDJJModel;
