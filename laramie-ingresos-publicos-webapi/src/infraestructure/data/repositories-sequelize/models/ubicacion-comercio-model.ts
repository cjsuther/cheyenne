import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import UbicacionComercioSchema from './ubicacion-comercio-schema';

const sequelize = createConnection(true);

class UbicacionComercioModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		parseFloat(this.getDataValue("coeficiente"))
	];

}

UbicacionComercioModel.init(UbicacionComercioSchema, {
  sequelize,
  modelName: 'UbicacionComercio',
  tableName: 'ubicacion_comercio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default UbicacionComercioModel;
