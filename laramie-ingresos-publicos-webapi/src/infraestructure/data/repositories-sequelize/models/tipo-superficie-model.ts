import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoSuperficieSchema from './tipo-superficie-schema';

const sequelize = createConnection(true);

class TipoSuperficieModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("clase"),
		this.getDataValue("suma"),
		this.getDataValue("adicionales")
	];

}

TipoSuperficieModel.init(TipoSuperficieSchema, {
  sequelize,
  modelName: 'TipoSuperficie',
  tableName: 'tipo_superficie',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoSuperficieModel;
