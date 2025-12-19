import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import RegistroCivilSchema from './registro-civil-schema';

const sequelize = createConnection(true);

class RegistroCivilModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

RegistroCivilModel.init(RegistroCivilSchema, {
  sequelize,
  modelName: 'RegistroCivil',
  tableName: 'registro_civil',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default RegistroCivilModel;
