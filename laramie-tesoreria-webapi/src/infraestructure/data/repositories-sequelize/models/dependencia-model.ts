import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import { hooksConfig } from './hooks-model';
import DependenciaSchema from './dependencia-schema';

const sequelize = createConnection(true);

class DependenciaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

DependenciaModel.init(DependenciaSchema, {
  sequelize,
  hooks: hooksConfig,
  modelName: 'Dependencia',
  tableName: 'dependencia',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default DependenciaModel;
