import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PlanPagoDefinicionSchema from './plan-pago-definicion-schema';

const sequelize = createConnection(true);

class PlanPagoDefinicionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEstadoPlanPagoDefinicion"),
		this.getDataValue("idTipoPlanPago"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("idTasaPlanPago"),
		this.getDataValue("idSubTasaPlanPago"),
		this.getDataValue("idTasaInteres"),
		this.getDataValue("idSubTasaInteres"),
		this.getDataValue("idTasaSellados"),
		this.getDataValue("idSubTasaSellados"),
		this.getDataValue("idTasaGastosCausidicos"),
		this.getDataValue("idSubTasaGastosCausidicos"),
		this.getDataValue("codigo"),
		this.getDataValue("descripcion"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta"),
		this.getDataValue("tieneAnticipo"),
		this.getDataValue("cuotaDesde"),
		this.getDataValue("cuotaHasta"),
		this.getDataValue("peridiocidad"),
		this.getDataValue("idTipoVencimientoAnticipo"),
		this.getDataValue("idTipoVencimientoCuota1"),
		this.getDataValue("idTipoVencimientoCuotas"),
		parseFloat(this.getDataValue("porcentajeAnticipo")),
		this.getDataValue("idTipoAlcanceTemporal"),
		this.getDataValue("fechaDesdeAlcanceTemporal"),
		this.getDataValue("fechaHastaAlcanceTemporal"),
		this.getDataValue("mesDesdeAlcanceTemporal"),
		this.getDataValue("mesHastaAlcanceTemporal"),
		this.getDataValue("aplicaDerechosEspontaneos"),
		this.getDataValue("aplicaCancelacionAnticipada"),
		this.getDataValue("aplicaTotalidadDeudaAdministrativa"),
		this.getDataValue("aplicaDeudaAdministrativa"),
		this.getDataValue("aplicaDeudaLegal"),
		this.getDataValue("aplicaGranContribuyente"),
		this.getDataValue("aplicaPequenioContribuyente"),
		this.getDataValue("caducidadAnticipoImpago"),
		this.getDataValue("caducidadCantidadCuotasConsecutivas"),
		this.getDataValue("caducidadCantidadCuotasNoConsecutivas"),
		this.getDataValue("caducidadCantidadDiasVencimiento"),
		this.getDataValue("caducidadCantidadDeclaracionesJuradas"),
		parseFloat(this.getDataValue("montoDeudaAdministrativaDesde")),
		parseFloat(this.getDataValue("montoDeudaAdministrativaHasta")),
		parseFloat(this.getDataValue("montoCuotaDesde")),
		parseFloat(this.getDataValue("montoCuotaHasta")),
		this.getDataValue("idTipoCalculoInteres"),
		this.getDataValue("idUsuarioCreacion"),
		this.getDataValue("fechaCreacion")
	];

}

PlanPagoDefinicionModel.init(PlanPagoDefinicionSchema, {
  sequelize,
  modelName: 'PlanPagoDefinicion',
  tableName: 'plan_pago_definicion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PlanPagoDefinicionModel;
