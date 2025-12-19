import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionDefinicionSchema from './emision-definicion-schema';

const sequelize = createConnection(true);

class EmisionDefinicionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("idNumeracion"),
		this.getDataValue("idProcedimiento"),
		this.getDataValue("idEstadoEmisionDefinicion"),
		this.getDataValue("idEmisionDefinicionBase"),
		this.getDataValue("numero"),
		this.getDataValue("descripcion"),
		this.getDataValue("codigoDelegacion"),
		this.getDataValue("periodo"),
		this.getDataValue("procesaPlanes"),
		this.getDataValue("procesaRubros"),
		this.getDataValue("procesaElementos"),
		this.getDataValue("calculoMostradorWeb"),
		this.getDataValue("calculoMasivo"),
		this.getDataValue("calculoPagoAnticipado"),
		this.getDataValue("fechaReliquidacionDesde"),
		this.getDataValue("fechaReliquidacionHasta"),
		this.getDataValue("modulo")
	];

}

EmisionDefinicionModel.init(EmisionDefinicionSchema, {
  sequelize,
  modelName: 'EmisionDefinicion',
  tableName: 'emision_definicion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionDefinicionModel;
