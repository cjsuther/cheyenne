import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TemaExpedienteSchema from './tema-expediente-schema';

const sequelize = createConnection(true);

class TemaExpedienteModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("ejercicioOficina"),
		this.getDataValue("oficina"),
		this.getDataValue("detalle"),
		this.getDataValue("plazo"),
		this.getDataValue("fechaAlta"),
		this.getDataValue("fechaBaja")
	];

}

TemaExpedienteModel.init(TemaExpedienteSchema, {
  sequelize,
  modelName: 'TemaExpediente',
  tableName: 'tema_expediente',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TemaExpedienteModel;
