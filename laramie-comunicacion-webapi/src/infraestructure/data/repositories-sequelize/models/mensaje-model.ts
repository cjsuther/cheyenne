import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import MensajeSchema from './mensaje-schema';

const sequelize = createConnection(true);

class MensajeModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoMensaje"),
		this.getDataValue("idEstadoMensaje"),
		this.getDataValue("idCanal"),
		this.getDataValue("idPrioridad"),
		this.getDataValue("identificador"),
		this.getDataValue("titulo"),
		this.getDataValue("cuerpo"),
		this.getDataValue("idUsuarioCreacion"),
		this.getDataValue("fechaCreacion"),
		this.getDataValue("fechaRecepcion"),
		this.getDataValue("fechaEnvio")
	];

}

MensajeModel.init(MensajeSchema, {
  sequelize,
  modelName: 'Mensaje',
  tableName: 'mensaje',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default MensajeModel;
