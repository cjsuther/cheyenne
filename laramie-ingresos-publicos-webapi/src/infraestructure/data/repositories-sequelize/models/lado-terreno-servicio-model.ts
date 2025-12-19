import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import LadoTerrenoServicioSchema from './lado-terreno-servicio-schema';

const sequelize = createConnection(true);

class LadoTerrenoServicioModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idLadoTerreno"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta")
	];

}

LadoTerrenoServicioModel.init(LadoTerrenoServicioSchema, {
  sequelize,
  modelName: 'LadoTerrenoServicio',
  tableName: 'lado_terreno_servicio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default LadoTerrenoServicioModel;
