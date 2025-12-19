import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ClaseElementoSchema from './clase-elemento-schema';

const sequelize = createConnection(true);

class ClaseElementoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("idTipoTributo")
	];

}

ClaseElementoModel.init(ClaseElementoSchema, {
  sequelize,
  modelName: 'ClaseElemento',
  tableName: 'clase_elemento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ClaseElementoModel;
