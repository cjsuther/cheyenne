import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoVehiculoSchema from './tipo-vehiculo-schema';

const sequelize = createConnection(true);

class TipoVehiculoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("idIncisoVehiculo")
	];

}

TipoVehiculoModel.init(TipoVehiculoSchema, {
  sequelize,
  modelName: 'TipoVehiculo',
  tableName: 'tipo_vehiculo',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoVehiculoModel;
