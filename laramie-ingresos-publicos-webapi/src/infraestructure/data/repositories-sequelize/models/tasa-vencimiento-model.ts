import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TasaVencimientoSchema from './tasa-vencimiento-schema';

const sequelize = createConnection(true);

class TasaVencimientoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("periodo"),
		this.getDataValue("cuota"),
		this.getDataValue("fechaVencimiento1"),
		this.getDataValue("fechaVencimiento2"),
		this.getDataValue("idEmisionEjecucion")
	];

}

TasaVencimientoModel.init(TasaVencimientoSchema, {
  sequelize,
  modelName: 'TasaVencimiento',
  tableName: 'tasa_vencimiento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TasaVencimientoModel;
