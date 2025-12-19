import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CuentaCorrienteItemSchema from './cuenta-corriente-item-schema';

const sequelize = createConnection(true);

class CuentaCorrienteItemModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("idEmisionCuentaCorrienteResultado"),
		this.getDataValue("idPlanPago"),
		this.getDataValue("idPlanPagoCuota"),
		this.getDataValue("idCertificadoApremio"),
		this.getDataValue("idCuenta"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("periodo"),
		this.getDataValue("cuota"),
		this.getDataValue("codigoDelegacion"),
		this.getDataValue("idTipoMovimiento"),
		this.getDataValue("numeroMovimiento"),
		this.getDataValue("numeroPartida"),
		this.getDataValue("tasaCabecera"),
		this.getDataValue("idTipoValor"),
		parseFloat(this.getDataValue("importeDebe")),
		parseFloat(this.getDataValue("importeHaber")),
		this.getDataValue("idLugarPago"),
		this.getDataValue("fechaOrigen"),
		this.getDataValue("fechaMovimiento"),
		this.getDataValue("fechaVencimiento1"),
		this.getDataValue("fechaVencimiento2"),
		this.getDataValue("cantidad"),
		this.getDataValue("idEdesurCliente"),
		this.getDataValue("detalle"),
		this.getDataValue("item"),
		this.getDataValue("idUsuarioRegistro"),
		this.getDataValue("fechaRegistro")
	];

}

CuentaCorrienteItemModel.init(CuentaCorrienteItemSchema, {
  sequelize,
  modelName: 'CuentaCorrienteItem',
  tableName: 'cuenta_corriente_item',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CuentaCorrienteItemModel;
