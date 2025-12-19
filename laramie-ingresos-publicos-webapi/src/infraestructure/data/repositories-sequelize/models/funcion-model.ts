import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import FuncionSchema from './funcion-schema';
import FuncionParametroModel from './funcion-parametro-model';

const sequelize = createConnection(true);

class FuncionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCategoriaFuncion"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("descripcion"),
		this.getDataValue("tipoDato"),
		this.getDataValue("modulo")
	];

}

FuncionModel.init(FuncionSchema, {
  sequelize,
  modelName: 'Funcion',
  tableName: 'funcion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

FuncionModel.hasMany(FuncionParametroModel, { as: 'funcionParametro', foreignKey: 'idFuncion' });

export default FuncionModel;
