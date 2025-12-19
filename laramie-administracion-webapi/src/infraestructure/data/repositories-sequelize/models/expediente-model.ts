import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ExpedienteSchema from './expediente-schema';

const sequelize = createConnection(true);

class ExpedienteModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("matricula"),
		this.getDataValue("ejercicio"),
		this.getDataValue("numero"),
		this.getDataValue("letra"),
		this.getDataValue("idProvincia"),
		this.getDataValue("idTipoExpediente"),
		this.getDataValue("subnumero"),
		this.getDataValue("idTemaExpediente"),
		this.getDataValue("referenciaExpediente"),
		this.getDataValue("fechaCreacion")
	];

}

ExpedienteModel.init(ExpedienteSchema, {
  sequelize,
  modelName: 'Expediente',
  tableName: 'expediente',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ExpedienteModel;
