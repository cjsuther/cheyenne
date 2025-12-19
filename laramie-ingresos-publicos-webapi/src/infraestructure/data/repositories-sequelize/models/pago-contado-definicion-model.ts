import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PagoContadoDefinicionSchema from './pago-contado-definicion-schema';

const sequelize = createConnection(true);

class PagoContadoDefinicionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEstadoPagoContadoDefinicion"),
		this.getDataValue("idTipoPlanPago"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("idTasaPagoContado"),
		this.getDataValue("idSubTasaPagoContado"),
		this.getDataValue("idTasaSellados"),
		this.getDataValue("idSubTasaSellados"),
		this.getDataValue("idTasaGastosCausidicos"),
		this.getDataValue("idSubTasaGastosCausidicos"),
		this.getDataValue("codigo"),
		this.getDataValue("descripcion"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta"),
		this.getDataValue("idTipoAlcanceTemporal"),
		this.getDataValue("fechaDesdeAlcanceTemporal"),
		this.getDataValue("fechaHastaAlcanceTemporal"),
		this.getDataValue("mesDesdeAlcanceTemporal"),
		this.getDataValue("mesHastaAlcanceTemporal"),
		this.getDataValue("aplicaDerechosEspontaneos"),
		this.getDataValue("aplicaTotalidadDeudaAdministrativa"),
		this.getDataValue("aplicaDeudaAdministrativa"),
		this.getDataValue("aplicaDeudaLegal"),
		this.getDataValue("aplicaGranContribuyente"),
		this.getDataValue("aplicaPequenioContribuyente"),
		parseFloat(this.getDataValue("montoDeudaAdministrativaDesde")),
		parseFloat(this.getDataValue("montoDeudaAdministrativaHasta")),
		this.getDataValue("idViaConsolidacion"),
		parseFloat(this.getDataValue("porcentajeQuitaRecargos")),
		parseFloat(this.getDataValue("porcentajeQuitaMultaInfracciones")),
		parseFloat(this.getDataValue("porcentajeQuitaHonorarios")),
		parseFloat(this.getDataValue("porcentajeQuitaAportes")),
		this.getDataValue("idUsuarioCreacion"),
		this.getDataValue("fechaCreacion")
	];

}

PagoContadoDefinicionModel.init(PagoContadoDefinicionSchema, {
  sequelize,
  modelName: 'PagoContadoDefinicion',
  tableName: 'pago_contado_definicion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PagoContadoDefinicionModel;
