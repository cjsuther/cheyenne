import { Model, Op } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import RubroComercioSchema from './rubro-comercio-schema';

const sequelize = createConnection(true);

class RubroComercioModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idComercio"),
		this.getDataValue("idTipoRubroComercio"),
		this.getDataValue("idUbicacionComercio"),
		this.getDataValue("idRubroLiquidacion"),
		this.getDataValue("idRubroProvincia"),
		this.getDataValue("idRubroBCRA"),
		this.getDataValue("descripcion"),
		this.getDataValue("esDeOficio"),
		this.getDataValue("esRubroPrincipal"),
		this.getDataValue("esConDDJJ"),
		this.getDataValue("fechaInicio"),
		this.getDataValue("fechaCese"),
		this.getDataValue("fechaAltaTransitoria"),
		this.getDataValue("fechaBajaTransitoria"),
		this.getDataValue("fechaBaja"),
		this.getDataValue("idMotivoBajaRubroComercio")
	];

}

RubroComercioModel.init(RubroComercioSchema, {
  sequelize,
  modelName: 'RubroComercio',
  tableName: 'rubro_comercio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default RubroComercioModel;
