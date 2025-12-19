import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TasaSchema from './tasa-schema';

const sequelize = createConnection(true);

class TasaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("idCategoriaTasa"),
		this.getDataValue("descripcion"),
		parseFloat(this.getDataValue("porcentajeDescuento"))
	];

}

TasaModel.init(TasaSchema, {
  sequelize,
  modelName: 'Tasa',
  tableName: 'tasa',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TasaModel;
