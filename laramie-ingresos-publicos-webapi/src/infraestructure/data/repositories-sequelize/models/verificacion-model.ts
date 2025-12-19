import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import VerificacionSchema from './verificacion-schema';

const sequelize = createConnection(true);

class VerificacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idInhumado"),
		this.getDataValue("fecha"),
		this.getDataValue("motivoVerificacion"),
		this.getDataValue("idTipoDocumentoVerificador"),
		this.getDataValue("numeroDocumentoVerificador"),
		this.getDataValue("apellidoVerificador"),
		this.getDataValue("nombreVerificador"),
		this.getDataValue("idResultadoVerificacion")
	];

}

VerificacionModel.init(VerificacionSchema, {
  sequelize,
  modelName: 'Verificacion',
  tableName: 'verificacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default VerificacionModel;
