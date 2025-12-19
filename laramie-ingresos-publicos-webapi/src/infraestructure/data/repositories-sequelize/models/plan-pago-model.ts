import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoSchema from './plan-pago-schema';

const sequelize = createConnection(true);

class PlanPagoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoPlanPago"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("idSubTasaPlanPago"),
		this.getDataValue("idSubTasaInteres"),
		this.getDataValue("idSubTasaSellados"),
		this.getDataValue("idSubTasaGastosCausidicos"),
		this.getDataValue("codigo"),
		this.getDataValue("descripcion"),
		this.getDataValue("numero"),
		this.getDataValue("idPlanPagoDefinicion"),
		this.getDataValue("idTributo"),
		this.getDataValue("idCuenta"),
		this.getDataValue("idTipoVinculoCuenta"),
		this.getDataValue("idVinculoCuenta"),
		parseFloat(this.getDataValue("importeNominal")),
		parseFloat(this.getDataValue("importeAccesorios")),
		parseFloat(this.getDataValue("importeCapital")),
		parseFloat(this.getDataValue("importeIntereses")),
		parseFloat(this.getDataValue("importeSellados")),
		parseFloat(this.getDataValue("importeGastosCausidicos")),
		parseFloat(this.getDataValue("importeQuita")),
		parseFloat(this.getDataValue("importeQuitaDevengar")),
		parseFloat(this.getDataValue("importePlanPago")),
		this.getDataValue("idUsuarioFirmante"),
		this.getDataValue("idUsuarioRegistro"),
		this.getDataValue("fechaRegistro")
	];

}

PlanPagoModel.init(PlanPagoSchema, {
  sequelize,
  modelName: 'PlanPago',
  tableName: 'plan_pago',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoModel;
