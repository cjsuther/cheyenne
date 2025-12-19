import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionCuotaSchema from './emision-cuota-schema';
import EmisionEjecucionCuotaModel from './emision-ejecucion-cuota-model';

const sequelize = createConnection(true);

class EmisionCuotaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("cuota"),
		this.getDataValue("mes"),
		this.getDataValue("descripcion"),
		this.getDataValue("formulaCondicion"),
		this.getDataValue("anioDDJJ"),
		this.getDataValue("mesDDJJ"),
		this.getDataValue("fechaVencimiento1"),
		this.getDataValue("fechaVencimiento2"),
		this.getDataValue("orden")
	];

}

EmisionCuotaModel.init(EmisionCuotaSchema, {
  sequelize,
  modelName: 'EmisionCuota',
  tableName: 'emision_cuota',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

EmisionCuotaModel.hasMany(EmisionEjecucionCuotaModel, { as: 'emisionEjecucionCuota', foreignKey: 'idEmisionCuota' });

EmisionEjecucionCuotaModel.belongsTo(EmisionCuotaModel, { as: 'emisionCuota', foreignKey: 'idEmisionCuota' });

export default EmisionCuotaModel;
