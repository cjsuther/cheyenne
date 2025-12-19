import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ArchivoSchema from './archivo-schema';

const sequelize = createConnection(true);

class ArchivoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("entidad"),
		this.getDataValue("idEntidad"),
		this.getDataValue("nombre"),
		this.getDataValue("path"),
    this.getDataValue("descripcion"),
    this.getDataValue("idUsuario"),
    this.getDataValue("fecha")
	];

}

ArchivoModel.init(ArchivoSchema, {
  sequelize,
  modelName: 'Archivo',
  tableName: 'archivo',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ArchivoModel;
