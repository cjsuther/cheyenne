import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ConfiguracionSchema from './configuracion-schema';

const sequelize = createConnection(true);

class ConfiguracionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("nombre"),
		this.getDataValue("valor")
	];

}

ConfiguracionModel.init(ConfiguracionSchema, {
  sequelize,
  modelName: 'Configuracion',
  tableName: 'configuracion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ConfiguracionModel;
