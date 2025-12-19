import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PagoRendicionSchema from './pago-rendicion-schema';

const sequelize = createConnection(true);

class PagoRendicionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPagoRendicionLote"),
		this.getDataValue("idCuentaPago"),
		this.getDataValue("codigoDelegacion"),
		this.getDataValue("numeroRecibo"),
		this.getDataValue("codigoLugarPago"),
		parseFloat(this.getDataValue("importePago")),
		this.getDataValue("fechaPago"),
		this.getDataValue("codigoBarras")
	];

}

PagoRendicionModel.init(PagoRendicionSchema, {
  sequelize,
  modelName: 'PagoRendicion',
  tableName: 'pago_rendicion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PagoRendicionModel;
