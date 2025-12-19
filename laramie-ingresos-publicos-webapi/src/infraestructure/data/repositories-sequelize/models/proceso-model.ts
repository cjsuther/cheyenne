import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ProcesoSchema from './proceso-schema';

const sequelize = createConnection(true);

class ProcesoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("identificador"),
		this.getDataValue("entidad"),
		this.getDataValue("idProcesoProgramacion"),
		this.getDataValue("idEstadoProceso"),
		this.getDataValue("fechaProceso"),
		this.getDataValue("fechaInicio"),
		this.getDataValue("fechaFin"),
		this.getDataValue("descripcion"),
		this.getDataValue("observacion"),
		parseFloat(this.getDataValue("avance")),
		this.getDataValue("origen"),
		this.getDataValue("idUsuarioCreacion"),
		this.getDataValue("fechaCreacion"),
		this.getDataValue("urlEjecucion")
	];

}

ProcesoModel.init(ProcesoSchema, {
  sequelize,
  modelName: 'Proceso',
  tableName: 'proceso',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ProcesoModel;
