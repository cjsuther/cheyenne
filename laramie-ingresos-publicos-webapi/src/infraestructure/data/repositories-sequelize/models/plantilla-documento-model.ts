import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlantillaDocumentoSchema from './plantilla-documento-schema';

const sequelize = createConnection(true);

class PlantillaDocumentoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoPlantillaDocumento"),
		this.getDataValue("descripcion"),
		this.getDataValue("nombre"),
		this.getDataValue("path"),
		this.getDataValue("idUsuario"),
		this.getDataValue("fecha")
	];

}

PlantillaDocumentoModel.init(PlantillaDocumentoSchema, {
  sequelize,
  modelName: 'PlantillaDocumento',
  tableName: 'plantilla_documento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlantillaDocumentoModel;
