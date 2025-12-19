import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionConceptoSchema from './emision-concepto-schema';

const sequelize = createConnection(true);

class EmisionConceptoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionDefinicion"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("idTipoMovimiento"),
		this.getDataValue("descripcion"),
		this.getDataValue("formulaCondicion"),
		this.getDataValue("formulaImporteTotal"),
		this.getDataValue("formulaImporteNeto"),
		this.getDataValue("vencimiento"),
		this.getDataValue("orden"),
		this.getDataValue("soloLectura")
	];

}

EmisionConceptoModel.init(EmisionConceptoSchema, {
  sequelize,
  modelName: 'EmisionConcepto',
  tableName: 'emision_concepto',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionConceptoModel;
