import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionImputacionContableResultadoSchema from './emision-imputacion-contable-resultado-schema';

const sequelize = createConnection(true);

class EmisionImputacionContableResultadoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("idEmisionEjecucionCuenta"),
		this.getDataValue("idEmisionImputacionContable"),
		this.getDataValue("idEmisionCuota"),
		this.getDataValue("idEstadoEmisionImputacionContableResultado"),
		this.getDataValue("valorPorcentaje"),
		this.getDataValue("observacion")
	];

}

EmisionImputacionContableResultadoModel.init(EmisionImputacionContableResultadoSchema, {
  sequelize,
  modelName: 'EmisionImputacionContableResultado',
  tableName: 'emision_imputacion_contable_resultado',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionImputacionContableResultadoModel;
