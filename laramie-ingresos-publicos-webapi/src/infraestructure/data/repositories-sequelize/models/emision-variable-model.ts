import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionVariableSchema from './emision-variable-schema';

const sequelize = createConnection(true);

class EmisionVariableModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionDefinicion"),
		this.getDataValue("idProcedimientoVariable")
	];

}

EmisionVariableModel.init(EmisionVariableSchema, {
  sequelize,
  modelName: 'EmisionVariable',
  tableName: 'emision_variable',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionVariableModel;
