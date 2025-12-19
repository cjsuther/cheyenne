import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CuentaPagoItemSchema from './cuenta-pago-item-schema';

const sequelize = createConnection(true);

class CuentaPagoItemModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("idEmisionConceptoResultado"),
		this.getDataValue("idPlanPagoCuota"),
		this.getDataValue("idCuentaPago"),
		this.getDataValue("idCuenta"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("periodo"),
		this.getDataValue("cuota"),
		parseFloat(this.getDataValue("importeNominal")),
		parseFloat(this.getDataValue("importeAccesorios")),
		parseFloat(this.getDataValue("importeRecargos")),
		parseFloat(this.getDataValue("importeMultas")),
		parseFloat(this.getDataValue("importeHonorarios")),
		parseFloat(this.getDataValue("importeAportes")),
		parseFloat(this.getDataValue("importeTotal")),
		parseFloat(this.getDataValue("importeNeto")),
		parseFloat(this.getDataValue("importeDescuento")),
		this.getDataValue("fechaVencimientoTermino"),
		this.getDataValue("fechaCobro"),
		this.getDataValue("idEdesurCliente"),
		this.getDataValue("item"),
		this.getDataValue("numeroPartida")
	];

}

CuentaPagoItemModel.init(CuentaPagoItemSchema, {
  sequelize,
  modelName: 'CuentaPagoItem',
  tableName: 'cuenta_pago_item',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CuentaPagoItemModel;
