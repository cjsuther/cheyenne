import { Model, Op } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import LadoTerrenoSchema from './lado-terreno-schema';
import DireccionModel from './direccion-model';
import LadoTerrenoServicioModel from './lado-terreno-servicio-model';
import LadoTerrenoObraModel from './lado-terreno-obra-model';

const sequelize = createConnection(true);

class LadoTerrenoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idInmueble"),
		this.getDataValue("idTipoLado"),
		this.getDataValue("numero"),
		parseFloat(this.getDataValue("metros")),
		parseFloat(this.getDataValue("reduccion"))
	];

}

LadoTerrenoModel.init(LadoTerrenoSchema, {
  sequelize,
  modelName: 'LadoTerreno',
  tableName: 'lado_terreno',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

LadoTerrenoModel.hasMany(DireccionModel, { as: 'direccion', foreignKey: 'idEntidad', 
	scope: {[Op.and]: sequelize.where(sequelize.col("direccion.entidad"), Op.eq, "LadoTerreno")}
});
LadoTerrenoModel.hasMany(LadoTerrenoServicioModel, { as: 'ladoTerrenoServicio', foreignKey: 'idLadoTerreno' });
LadoTerrenoModel.hasMany(LadoTerrenoObraModel, { as: 'ladoTerrenoObra', foreignKey: 'idLadoTerreno' });

export default LadoTerrenoModel;
