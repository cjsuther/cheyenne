import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import AccesoSchema from './acceso-schema';

const sequelize = createConnection(true);

class AccesoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idUsuario"),
		this.getDataValue("idTipoAcceso"),
		this.getDataValue("identificador"),
		this.getDataValue("password")
	];

}

AccesoModel.init(AccesoSchema, {
  sequelize,
  modelName: 'Acceso',
  tableName: 'acceso',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default AccesoModel;
