import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionCalculoResultadoSchema from './emision-calculo-resultado-schema';

const sequelize = createConnection(true);

class EmisionCalculoResultadoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("idEmisionEjecucionCuenta"),
		this.getDataValue("idEmisionCalculo"),
		this.getDataValue("idEmisionCuota"),
		this.getDataValue("idEstadoEmisionCalculoResultado"),
		this.getDataValue("valor"),
		this.getDataValue("observacion")
	];

}

EmisionCalculoResultadoModel.init(EmisionCalculoResultadoSchema, {
  sequelize,
  modelName: 'EmisionCalculoResultado',
  tableName: 'emision_calculo_resultado',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionCalculoResultadoModel;
