import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import JurisdiccionSchema from './jurisdiccion-schema';

const sequelize = createConnection(true);

class JurisdiccionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("ejercicio"),
		this.getDataValue("agrupamiento"),
		this.getDataValue("fecha"),
		this.getDataValue("nivel"),
		this.getDataValue("tipo")
	];

}

JurisdiccionModel.init(JurisdiccionSchema, {
  sequelize,
  modelName: 'Jurisdiccion',
  tableName: 'jurisdiccion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default JurisdiccionModel;
