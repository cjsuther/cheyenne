import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionCuentaCorrienteSchema from './emision-cuenta-corriente-schema';

const sequelize = createConnection(true);

class EmisionCuentaCorrienteModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionDefinicion"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("idTipoMovimiento"),
		this.getDataValue("tasaCabecera"),
		this.getDataValue("descripcion"),
		this.getDataValue("formulaCondicion"),
		this.getDataValue("formulaDebe"),
		this.getDataValue("formulaHaber"),
		this.getDataValue("vencimiento"),
		this.getDataValue("orden"),
		this.getDataValue("soloLectura")
	];

}

EmisionCuentaCorrienteModel.init(EmisionCuentaCorrienteSchema, {
  sequelize,
  modelName: 'EmisionCuentaCorriente',
  tableName: 'emision_cuenta_corriente',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionCuentaCorrienteModel;
