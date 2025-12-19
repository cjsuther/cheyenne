import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import VariableSchema from './variable-schema';

const sequelize = createConnection(true);

class VariableModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("descripcion"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("tipoDato"),
		this.getDataValue("constante"),
		this.getDataValue("predefinido"),
		this.getDataValue("opcional"),
		this.getDataValue("activo"),
		this.getDataValue("global")
	];

}

VariableModel.init(VariableSchema, {
  sequelize,
  modelName: 'Variable',
  tableName: 'variable',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default VariableModel;
