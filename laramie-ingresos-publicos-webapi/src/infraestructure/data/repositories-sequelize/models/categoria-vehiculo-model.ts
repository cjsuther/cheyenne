import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CategoriaVehiculoSchema from './categoria-vehiculo-schema';

const sequelize = createConnection(true);

class CategoriaVehiculoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("idIncisoVehiculo"),
		this.getDataValue("limiteInferior"),
		this.getDataValue("limiteSuperior")
	];

}

CategoriaVehiculoModel.init(CategoriaVehiculoSchema, {
  sequelize,
  modelName: 'CategoriaVehiculo',
  tableName: 'categoria_vehiculo',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CategoriaVehiculoModel;
