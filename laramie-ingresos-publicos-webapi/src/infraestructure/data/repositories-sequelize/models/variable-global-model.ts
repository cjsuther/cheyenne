import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import variableGlobalSchema from './variable-global-schema';

const sequelize = createConnection(true);

class VariableGlobalModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idVariable"),
		this.getDataValue("valor"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta")
	];

}

VariableGlobalModel.init(variableGlobalSchema, {
  sequelize,
  modelName: 'variable_global',
  tableName: 'variable_global',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default VariableGlobalModel;
