import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoInstrumentoSchema from './tipo-instrumento-schema';

const sequelize = createConnection(true);

class TipoInstrumentoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

TipoInstrumentoModel.init(TipoInstrumentoSchema, {
  sequelize,
  modelName: 'TipoInstrumento',
  tableName: 'tipo_instrumento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoInstrumentoModel;
