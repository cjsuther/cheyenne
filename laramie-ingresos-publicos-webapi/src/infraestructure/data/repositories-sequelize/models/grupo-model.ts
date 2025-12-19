import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import GrupoSchema from './grupo-schema';

const sequelize = createConnection(true);

class GrupoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

GrupoModel.init(GrupoSchema, {
  sequelize,
  modelName: 'Grupo',
  tableName: 'grupo',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default GrupoModel;
