import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import JuicioCitacionSchema from './juicio-citacion-schema';

const sequelize = createConnection(true);

class JuicioCitacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idApremio"),
		this.getDataValue("fechaCitacion"),
		this.getDataValue("idTipoCitacion"),
		this.getDataValue("observacion")
	];

}

JuicioCitacionModel.init(JuicioCitacionSchema, {
  sequelize,
  modelName: 'JuicioCitacion',
  tableName: 'juicio_citacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default JuicioCitacionModel;
