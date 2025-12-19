import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ControladorCuentaSchema from './controlador-cuenta-schema';

const sequelize = createConnection(true);

class ControladorCuentaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCuenta"),
		this.getDataValue("idTipoControlador"),
		this.getDataValue("idControlador"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta")
	];

}

ControladorCuentaModel.init(ControladorCuentaSchema, {
  sequelize,
  modelName: 'ControladorCuenta',
  tableName: 'controlador_cuenta',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ControladorCuentaModel;
