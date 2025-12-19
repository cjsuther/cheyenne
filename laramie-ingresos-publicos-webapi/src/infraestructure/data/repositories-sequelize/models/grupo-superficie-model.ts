import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import GrupoSuperficieSchema from './grupo-superficie-schema';

const sequelize = createConnection(true);

class GrupoSuperficieModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

GrupoSuperficieModel.init(GrupoSuperficieSchema, {
  sequelize,
  modelName: 'GrupoSuperficie',
  tableName: 'grupo_superficie',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default GrupoSuperficieModel;
