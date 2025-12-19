import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionEjecucionSchema from './emision-ejecucion-schema';

const sequelize = createConnection(true);

class EmisionEjecucionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionDefinicion"),
		this.getDataValue("idEstadoEmisionEjecucion"),
		this.getDataValue("numero"),
		this.getDataValue("descripcion"),
		this.getDataValue("descripcionAbreviada"),
		this.getDataValue("periodo"),
		this.getDataValue("imprimeRecibosEmision"),
		this.getDataValue("aplicaDebitoAutomatico"),
		this.getDataValue("calculoMostradorWeb"),
		this.getDataValue("calculoMasivo"),
		this.getDataValue("calculoPrueba"),
		this.getDataValue("calculoPagoAnticipado"),
		this.getDataValue("fechaPagoAnticipadoVencimiento1"),
		this.getDataValue("fechaPagoAnticipadoVencimiento2"),
		this.getDataValue("fechaEjecucionInicio"),
		this.getDataValue("fechaEjecucionFin")
	];

}

EmisionEjecucionModel.init(EmisionEjecucionSchema, {
  sequelize,
  modelName: 'EmisionEjecucion',
  tableName: 'emision_ejecucion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionEjecucionModel;
