import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import RelacionCuentaSchema from './relacion-cuenta-schema';

const sequelize = createConnection(true);

class RelacionCuentaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCuenta1"),
		this.getDataValue("idCuenta2")
	];

}

RelacionCuentaModel.init(RelacionCuentaSchema, {
  sequelize,
  modelName: 'RelacionCuenta',
  tableName: 'relacion_cuenta',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default RelacionCuentaModel;
