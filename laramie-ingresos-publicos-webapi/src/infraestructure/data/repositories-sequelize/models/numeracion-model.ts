import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import NumeracionSchema from './numeracion-schema';

const sequelize = createConnection(true);

class NumeracionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("nombre"),
		this.getDataValue("valorProximo")
	];

}

NumeracionModel.init(NumeracionSchema, {
  sequelize,
  modelName: 'Numeracion',
  tableName: 'numeracion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default NumeracionModel;
