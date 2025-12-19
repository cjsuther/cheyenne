import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import VerificacionSchema from './verificacion-schema';

const sequelize = createConnection(true);

class VerificacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoVerificacion"),
		this.getDataValue("idEstadoVerificacion"),
		this.getDataValue("idUsuario"),
		this.getDataValue("codigo"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta"),
		this.getDataValue("token"),
		this.getDataValue("detalle")
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
