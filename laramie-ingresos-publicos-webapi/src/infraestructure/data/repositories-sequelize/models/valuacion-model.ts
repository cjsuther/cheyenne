import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ValuacionSchema from './valuacion-schema';

const sequelize = createConnection(true);

class ValuacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idInmueble"),
		this.getDataValue("idTipoValuacion"),
		this.getDataValue("ejercicio"),
		this.getDataValue("mes"),
		parseFloat(this.getDataValue("valor"))
	];

}

ValuacionModel.init(ValuacionSchema, {
  sequelize,
  modelName: 'Valuacion',
  tableName: 'valuacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ValuacionModel;
