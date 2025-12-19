import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoAnuncioSchema from './tipo-anuncio-schema';

const sequelize = createConnection(true);

class TipoAnuncioModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		parseFloat(this.getDataValue("porcentaje")),
		parseFloat(this.getDataValue("importe"))
	];

}

TipoAnuncioModel.init(TipoAnuncioSchema, {
  sequelize,
  modelName: 'TipoAnuncio',
  tableName: 'tipo_anuncio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoAnuncioModel;
