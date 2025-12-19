import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CuotaPorcentajeSchema from './cuota-porcentaje-schema';

const sequelize = createConnection(true);

class CuotaPorcentajeModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("idEmisionImputacionContableResultado"),
		this.getDataValue("idCuenta"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("periodo"),
		this.getDataValue("cuota"),
		this.getDataValue("idTasaPorcentaje"),
		this.getDataValue("idSubTasaPorcentaje"),
		parseFloat(this.getDataValue("porcentaje")),
		parseFloat(this.getDataValue("importePorcentaje")),
		this.getDataValue("ejercicio")
	];

}

CuotaPorcentajeModel.init(CuotaPorcentajeSchema, {
  sequelize,
  modelName: 'CuotaPorcentaje',
  tableName: 'cuota_porcentaje',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CuotaPorcentajeModel;
