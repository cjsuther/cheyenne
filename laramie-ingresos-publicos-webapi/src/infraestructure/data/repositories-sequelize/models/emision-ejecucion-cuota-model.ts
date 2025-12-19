import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionEjecucionCuotaSchema from './emision-ejecucion-cuota-schema';

const sequelize = createConnection(true);

class EmisionEjecucionCuotaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("idEmisionEjecucionCuenta"),
		this.getDataValue("idEmisionCuota"),
		this.getDataValue("idPlanPagoCuota"),
		this.getDataValue("numeroRecibo"),
		this.getDataValue("codigoBarras"),
		this.getDataValue("orden")
	];

}

EmisionEjecucionCuotaModel.init(EmisionEjecucionCuotaSchema, {
  sequelize,
  modelName: 'EmisionEjecucionCuota',
  tableName: 'emision_ejecucion_cuota',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionEjecucionCuotaModel;
