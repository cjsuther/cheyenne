import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import LocalidadSchema from './localidad-schema';

const sequelize = createConnection(true);

class LocalidadModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("idProvincia")
	];

}

LocalidadModel.init(LocalidadSchema, {
  sequelize,
  modelName: 'Localidad',
  tableName: 'localidad',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default LocalidadModel;
