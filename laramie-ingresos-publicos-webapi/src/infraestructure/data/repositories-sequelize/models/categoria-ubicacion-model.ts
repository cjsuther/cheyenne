import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CategoriaUbicacionSchema from './categoria-ubicacion-schema';

const sequelize = createConnection(true);

class CategoriaUbicacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		parseFloat(this.getDataValue("coeficiente"))
	];

}

CategoriaUbicacionModel.init(CategoriaUbicacionSchema, {
  sequelize,
  modelName: 'CategoriaUbicacion',
  tableName: 'categoria_ubicacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CategoriaUbicacionModel;
