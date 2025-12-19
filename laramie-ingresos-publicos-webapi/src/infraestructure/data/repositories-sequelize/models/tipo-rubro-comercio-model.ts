import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoRubroComercioSchema from './tipo-rubro-comercio-schema';

const sequelize = createConnection(true);

class TipoRubroComercioModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("agrupamiento"),
		this.getDataValue("fechaBaja"),
		this.getDataValue("facturable"),
		this.getDataValue("generico"),
		this.getDataValue("categoria"),
		parseFloat(this.getDataValue("importeMinimo")),
		parseFloat(this.getDataValue("alicuota")),
		this.getDataValue("regimenGeneral")
	];

}

TipoRubroComercioModel.init(TipoRubroComercioSchema, {
  sequelize,
  modelName: 'TipoRubroComercio',
  tableName: 'tipo_rubro_comercio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoRubroComercioModel;
