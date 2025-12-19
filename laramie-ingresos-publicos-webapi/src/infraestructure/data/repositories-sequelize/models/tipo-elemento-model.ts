import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoElementoSchema from './tipo-elemento-schema';

const sequelize = createConnection(true);

class TipoElementoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("idClaseElemento"),
		this.getDataValue("idUnidadMedida"),
		parseFloat(this.getDataValue("valor"))
	];

}

TipoElementoModel.init(TipoElementoSchema, {
  sequelize,
  modelName: 'TipoElemento',
  tableName: 'tipo_elemento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoElementoModel;
