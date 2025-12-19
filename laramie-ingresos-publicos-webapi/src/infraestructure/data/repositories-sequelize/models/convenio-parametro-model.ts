import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ConvenioParametroSchema from './convenio-parametro-schema';

const sequelize = createConnection(true);

class ConvenioParametroModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

ConvenioParametroModel.init(ConvenioParametroSchema, {
  sequelize,
  modelName: 'ConvenioParametro',
  tableName: 'convenio_parametro',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ConvenioParametroModel;
