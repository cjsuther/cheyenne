import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import DeclaracionJuradaComercioSchema from './declaracion-jurada-comercio-schema';

const sequelize = createConnection(true);

class DeclaracionJuradaComercioModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCuenta"),
		this.getDataValue("fechaPresentacionDDJJ"),
		this.getDataValue("anioDeclaracion"),
		this.getDataValue("mesDeclaracion"),
		this.getDataValue("numero"),
		this.getDataValue("idTipoDDJJ"),
		this.getDataValue("fechaAlta"),
		this.getDataValue("fechaBaja"),
		this.getDataValue("resolucion"),
		this.getDataValue("titulares"),
		this.getDataValue("dependientes"),
		parseFloat(this.getDataValue("importeExportaciones")),
		parseFloat(this.getDataValue("importeTotalPais"))
	];

}

DeclaracionJuradaComercioModel.init(DeclaracionJuradaComercioSchema, {
  sequelize,
  modelName: 'DeclaracionJuradaComercio',
  tableName: 'declaracion_jurada_comercio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default DeclaracionJuradaComercioModel;
