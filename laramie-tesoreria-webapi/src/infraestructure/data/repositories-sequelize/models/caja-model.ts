import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import { hooksConfig } from './hooks-model';
import CajaSchema from './caja-schema';
import CajaAsignacionModel from './caja-asignacion-model';

const sequelize = createConnection(true);

class CajaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("idDependencia"),
		this.getDataValue("idEstadoCaja"),
		this.getDataValue("idUsuarioActual"),
		this.getDataValue("idCajaAsignacionActual"),
		this.getDataValue("idRecaudadora")
	];

}

CajaModel.init(CajaSchema, {
  sequelize,
  hooks: hooksConfig,
  modelName: 'Caja',
  tableName: 'caja',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CajaModel;
