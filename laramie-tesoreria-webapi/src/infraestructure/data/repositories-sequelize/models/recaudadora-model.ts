import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import { hooksConfig } from './hooks-model';
import RecaudadoraSchema from './recaudadora-schema';

const sequelize = createConnection(true);

class RecaudadoraModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("codigoCliente"),
		this.getDataValue("idLugarPago"),
		this.getDataValue("idMetodoImportacion")
	];

}

RecaudadoraModel.init(RecaudadoraSchema, {
  sequelize,
  hooks: hooksConfig,
  modelName: 'Recaudadora',
  tableName: 'recaudadora',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default RecaudadoraModel;
