import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import LadoTerrenoObraSchema from './lado-terreno-obra-schema';

const sequelize = createConnection(true);

class LadoTerrenoObraModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idLadoTerreno"),
		this.getDataValue("idObra"),
		parseFloat(this.getDataValue("importe")),
		parseFloat(this.getDataValue("reduccionMetros")),
		parseFloat(this.getDataValue("reduccionSuperficie")),
		this.getDataValue("fecha")
	];

}

LadoTerrenoObraModel.init(LadoTerrenoObraSchema, {
  sequelize,
  modelName: 'LadoTerrenoObra',
  tableName: 'lado_terreno_obra',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default LadoTerrenoObraModel;
