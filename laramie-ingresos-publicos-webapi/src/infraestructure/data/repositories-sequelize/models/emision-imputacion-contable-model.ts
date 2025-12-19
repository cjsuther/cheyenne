import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionImputacionContableSchema from './emision-imputacion-contable-schema';

const sequelize = createConnection(true);

class EmisionImputacionContableModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionDefinicion"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("idTipoMovimiento"),
		this.getDataValue("descripcion"),
		this.getDataValue("formulaCondicion"),
		this.getDataValue("formulaPorcentaje"),
		this.getDataValue("idTasaPorcentaje"),
		this.getDataValue("idSubTasaPorcentaje"),
		this.getDataValue("orden"),
		this.getDataValue("soloLectura")
	];

}

EmisionImputacionContableModel.init(EmisionImputacionContableSchema, {
  sequelize,
  modelName: 'EmisionImputacionContable',
  tableName: 'emision_imputacion_contable',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionImputacionContableModel;
