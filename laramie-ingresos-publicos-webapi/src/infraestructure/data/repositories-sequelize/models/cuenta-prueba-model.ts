import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CuentaPruebaSchema from './cuenta-prueba-schema';
import CuentaModel from './cuenta-model';

const sequelize = createConnection(true);

class CuentaPruebaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("idCuenta"),
		this.getDataValue("comentario")
	];

}

CuentaPruebaModel.init(CuentaPruebaSchema, {
  sequelize,
  modelName: 'CuentaPrueba',
  tableName: 'cuenta_prueba',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

CuentaPruebaModel.hasOne(CuentaModel, { foreignKey: 'id', sourceKey: 'idCuenta', as: 'cuenta' })

export default CuentaPruebaModel;
