import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import FuncionParametroSchema from './funcion-parametro-schema';

const sequelize = createConnection(true);

class FuncionParametroModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idFuncion"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("tipoDato"),
		this.getDataValue("orden")
	];

}

FuncionParametroModel.init(FuncionParametroSchema, {
  sequelize,
  modelName: 'FuncionParametro',
  tableName: 'funcion_parametro',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default FuncionParametroModel;
