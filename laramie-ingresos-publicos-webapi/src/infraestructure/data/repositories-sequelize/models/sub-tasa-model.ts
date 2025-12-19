import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import SubTasaSchema from './sub-tasa-schema';

const sequelize = createConnection(true);

class SubTasaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTasa"),
		this.getDataValue("codigo"),
		this.getDataValue("descripcion"),
		parseFloat(this.getDataValue("impuestoNacional")),
		parseFloat(this.getDataValue("impuestoProvincial")),
		parseFloat(this.getDataValue("ctasCtes")),
		parseFloat(this.getDataValue("timbradosExtras")),
		this.getDataValue("descripcionReducida"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta"),
		this.getDataValue("rubroGenerico"),
		this.getDataValue("liquidableCtaCte"),
		this.getDataValue("liquidableDDJJ"),
		this.getDataValue("actualizacion"),
		this.getDataValue("accesorios"),
		this.getDataValue("internetDDJJ"),
		this.getDataValue("imputXPorc")
	];

}

SubTasaModel.init(SubTasaSchema, {
  sequelize,
  modelName: 'SubTasa',
  tableName: 'sub_tasa',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default SubTasaModel;
