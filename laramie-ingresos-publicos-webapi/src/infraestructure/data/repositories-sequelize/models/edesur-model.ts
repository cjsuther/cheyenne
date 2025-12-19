import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EdesurSchema from './edesur-schema';
import EdesurClienteModel from './edesur-cliente-model';

const sequelize = createConnection(true);

class EdesurModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idInmueble"),
		this.getDataValue("ultPeriodoEdesur"),
		this.getDataValue("ultCuotaEdesur"),
		parseFloat(this.getDataValue("ultImporteEdesur")),
		this.getDataValue("medidor"),
		this.getDataValue("idFrecuenciaFacturacion"),
		this.getDataValue("plan"),
		this.getDataValue("radio"),
		this.getDataValue("manzana"),
		this.getDataValue("idAnteriorEdesur"),
		parseFloat(this.getDataValue("tarifa")),
		parseFloat(this.getDataValue("tarifa1")),
		this.getDataValue("claseServicio"),
		parseFloat(this.getDataValue("porcDesc")),
		this.getDataValue("cAnual"),
		this.getDataValue("recorrido"),
		this.getDataValue("planB"),
		this.getDataValue("lzEdesur"),
		this.getDataValue("facturarABL"),
		this.getDataValue("facturar"),
		this.getDataValue("facturarEdesur"),
		this.getDataValue("comuna"),
		this.getDataValue("calleEdesur"),
		this.getDataValue("numeroEdesur")
	];

}

EdesurModel.init(EdesurSchema, {
  sequelize,
  modelName: 'Edesur',
  tableName: 'edesur',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

EdesurModel.hasMany(EdesurClienteModel, { as: 'edesurCliente', foreignKey: 'idEdesur' });

export default EdesurModel;