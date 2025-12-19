import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import VariableCuentaSchema from './variable-cuenta-schema';

const sequelize = createConnection(true);

class VariableCuentaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idVariable"),
		this.getDataValue("idCuenta"),
		this.getDataValue("valor"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta")
	];

}

VariableCuentaModel.init(VariableCuentaSchema, {
  sequelize,
  modelName: 'VariableCuenta',
  tableName: 'variable_cuenta',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default VariableCuentaModel;
