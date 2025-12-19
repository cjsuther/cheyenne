import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionConceptoResultadoSchema from './emision-concepto-resultado-schema';

const sequelize = createConnection(true);

class EmisionConceptoResultadoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("idEmisionEjecucionCuenta"),
		this.getDataValue("idEmisionConcepto"),
		this.getDataValue("idEmisionCuota"),
		this.getDataValue("idEstadoEmisionConceptoResultado"),
		this.getDataValue("valorImporteTotal"),
		this.getDataValue("valorImporteNeto"),
		this.getDataValue("observacion")
	];

}

EmisionConceptoResultadoModel.init(EmisionConceptoResultadoSchema, {
  sequelize,
  modelName: 'EmisionConceptoResultado',
  tableName: 'emision_concepto_resultado',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionConceptoResultadoModel;
