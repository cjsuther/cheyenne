import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import InspeccionSchema from './inspeccion-schema';

const sequelize = createConnection(true);

class InspeccionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idComercio"),
		this.getDataValue("numero"),
		this.getDataValue("idMotivoInspeccion"),
		this.getDataValue("idSupervisor"),
		this.getDataValue("idInspector"),
		this.getDataValue("fechaInicio"),
		this.getDataValue("fechaFinalizacion"),
		this.getDataValue("fechaNotificacion"),
		this.getDataValue("fechaBaja"),
		this.getDataValue("anioDesde"),
		this.getDataValue("mesDesde"),
		this.getDataValue("anioHasta"),
		this.getDataValue("mesHasta"),
		this.getDataValue("numeroResolucion"),
		this.getDataValue("letraResolucion"),
		this.getDataValue("anioResolucion"),
		this.getDataValue("fechaResolucion"),
		this.getDataValue("numeroLegajillo"),
		this.getDataValue("letraLegajillo"),
		this.getDataValue("anioLegajillo"),
		this.getDataValue("activo"),
		parseFloat(this.getDataValue("porcentajeMulta")),
		this.getDataValue("emiteConstancia"),
		this.getDataValue("pagaPorcentaje"),
		this.getDataValue("idExpediente")
	];

}

InspeccionModel.init(InspeccionSchema, {
  sequelize,
  modelName: 'Inspeccion',
  tableName: 'inspeccion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default InspeccionModel;
