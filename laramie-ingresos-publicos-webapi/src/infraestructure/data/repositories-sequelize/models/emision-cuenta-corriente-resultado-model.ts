import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionCuentaCorrienteResultadoSchema from './emision-cuenta-corriente-resultado-schema';

const sequelize = createConnection(true);

class EmisionCuentaCorrienteResultadoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("idEmisionEjecucionCuenta"),
		this.getDataValue("idEmisionCuentaCorriente"),
		this.getDataValue("idEmisionCuota"),
		this.getDataValue("idEstadoEmisionCuentaCorrienteResultado"),
		this.getDataValue("valorDebe"),
		this.getDataValue("valorHaber"),
		this.getDataValue("observacion")
	];

}

EmisionCuentaCorrienteResultadoModel.init(EmisionCuentaCorrienteResultadoSchema, {
  sequelize,
  modelName: 'EmisionCuentaCorrienteResultado',
  tableName: 'emision_cuenta_corriente_resultado',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionCuentaCorrienteResultadoModel;
