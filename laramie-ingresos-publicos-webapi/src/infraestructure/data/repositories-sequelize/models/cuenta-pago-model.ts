import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CuentaPagoSchema from './cuenta-pago-schema';

const sequelize = createConnection(true);

class CuentaPagoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("idPlanPago"),
		this.getDataValue("idCuenta"),
		this.getDataValue("codigoDelegacion"),
		this.getDataValue("numeroRecibo"),
		this.getDataValue("periodo"),
		this.getDataValue("cuota"),
		parseFloat(this.getDataValue("importeVencimiento1")),
		parseFloat(this.getDataValue("importeVencimiento2")),
		this.getDataValue("fechaVencimiento1"),
		this.getDataValue("fechaVencimiento2"),
		this.getDataValue("codigoBarras"),
		this.getDataValue("pagoAnticipado"),
		this.getDataValue("reciboEspecial")
	];

}

CuentaPagoModel.init(CuentaPagoSchema, {
  sequelize,
  modelName: 'CuentaPago',
  tableName: 'cuenta_pago',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CuentaPagoModel;
