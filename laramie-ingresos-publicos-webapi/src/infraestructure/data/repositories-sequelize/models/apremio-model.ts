import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ApremioSchema from './apremio-schema';

const sequelize = createConnection(true);

class ApremioModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("numero"),
		this.getDataValue("idExpediente"),
		this.getDataValue("idOrganismoJudicial"),
		this.getDataValue("fechaInicioDemanda"),
		this.getDataValue("carpeta"),
		this.getDataValue("caratula"),
		this.getDataValue("estado")
	];

}

ApremioModel.init(ApremioSchema, {
  sequelize,
  modelName: 'Apremio',
  tableName: 'apremio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ApremioModel;
