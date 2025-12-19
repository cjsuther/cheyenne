import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ContribuyenteCuentaSchema from './contribuyente-cuenta-schema';
import ContribuyenteModel from './contribuyente-model';
import CuentaModel from './cuenta-model';

const sequelize = createConnection(true);

class ContribuyenteCuentaModel extends Model {

	getDataValues = () => [
		this.getDataValue("idContribuyente"),
		this.getDataValue("idCuenta")
	];

}

ContribuyenteCuentaModel.init(ContribuyenteCuentaSchema, {
  sequelize,
  modelName: 'ContribuyenteCuenta',
  tableName: 'contribuyente_cuenta',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

ContribuyenteModel.hasMany(ContribuyenteCuentaModel, { as: 'contribuyenteCuenta', foreignKey: 'idContribuyente' });
CuentaModel.hasMany(ContribuyenteCuentaModel, { as: 'contribuyenteCuenta', foreignKey: 'idCuenta' });

export default ContribuyenteCuentaModel;
