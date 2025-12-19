import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import sesionSchema from './sesion-schema';

const sequelize = createConnection(true);

class sesionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("token"),
		this.getDataValue("fechaVencimiento"),
		this.getDataValue("fechaCreacion")
	];

}

sesionModel.init(sesionSchema, {
  sequelize,
  modelName: 'sesion',
  tableName: 'sesion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default sesionModel;
