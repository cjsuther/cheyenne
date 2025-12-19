import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CuentaContableSchema from './cuenta-contable-schema';

const sequelize = createConnection(true);

class CuentaContableModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("agrupamiento")
	];

}

CuentaContableModel.init(CuentaContableSchema, {
  sequelize,
  modelName: 'CuentaContable',
  tableName: 'cuenta_contable',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CuentaContableModel;
