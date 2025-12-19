import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CodigoBarrasClienteSchema from './codigo-barras-cliente-schema';

const sequelize = createConnection(true);

class CodigoBarrasClienteModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoCodigoBarras"),
		this.getDataValue("codigoBarras"),
		this.getDataValue("codigoBarrasCliente")
	];

}

CodigoBarrasClienteModel.init(CodigoBarrasClienteSchema, {
  sequelize,
  modelName: 'CodigoBarrasCliente',
  tableName: 'codigo_barras_cliente',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CodigoBarrasClienteModel;
