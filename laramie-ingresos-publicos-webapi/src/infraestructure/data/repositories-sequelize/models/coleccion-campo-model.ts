import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ColeccionCampoSchema from './coleccion-campo-schema';

const sequelize = createConnection(true);

class ColeccionCampoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idColeccion"),
		this.getDataValue("idTipoVariable"),
		this.getDataValue("campo"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("tipoDato"),
		this.getDataValue("orden")
	];

}

ColeccionCampoModel.init(ColeccionCampoSchema, {
  sequelize,
  modelName: 'ColeccionCampo',
  tableName: 'coleccion_campo',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ColeccionCampoModel;
