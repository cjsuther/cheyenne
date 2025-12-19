import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ActoProcesalSchema from './acto-procesal-schema';

const sequelize = createConnection(true);

class ActoProcesalModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idApremio"),
		this.getDataValue("idTipoActoProcesal"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta"),
		this.getDataValue("observacion")
	];

}

ActoProcesalModel.init(ActoProcesalSchema, {
  sequelize,
  modelName: 'ActoProcesal',
  tableName: 'acto_procesal',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ActoProcesalModel;
