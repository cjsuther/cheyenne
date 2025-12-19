import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import IncisoVehiculoSchema from './inciso-vehiculo-schema';

const sequelize = createConnection(true);

class IncisoVehiculoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("vehiculoMenor")
	];

}

IncisoVehiculoModel.init(IncisoVehiculoSchema, {
  sequelize,
  modelName: 'IncisoVehiculo',
  tableName: 'inciso_vehiculo',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default IncisoVehiculoModel;
