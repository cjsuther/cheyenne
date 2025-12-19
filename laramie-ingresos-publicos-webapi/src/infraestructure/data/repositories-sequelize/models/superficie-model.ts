import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import SuperficieSchema from './superficie-schema';

const sequelize = createConnection(true);

class SuperficieModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idInmueble"),
		this.getDataValue("nroSuperficie"),
		this.getDataValue("nroInterno"),
		this.getDataValue("nroDeclaracionJurada"),
		this.getDataValue("idTipoSuperficie"),
		parseFloat(this.getDataValue("metros")),
		this.getDataValue("plano"),
		this.getDataValue("idGrupoSuperficie"),
		this.getDataValue("idTipoObraSuperficie"),
		this.getDataValue("idDestinoSuperficie"),
		this.getDataValue("fechaIntimacion"),
		this.getDataValue("nroIntimacion"),
		this.getDataValue("nroAnterior"),
		this.getDataValue("fechaPresentacion"),
		this.getDataValue("fechaVigenteDesde"),
		this.getDataValue("fechaRegistrado"),
		this.getDataValue("fechaPermisoProvisorio"),
		this.getDataValue("fechaAprobacion"),
		this.getDataValue("conformeObra"),
		this.getDataValue("fechaFinObra"),
		this.getDataValue("ratificacion"),
		this.getDataValue("derechos")
	];

}

SuperficieModel.init(SuperficieSchema, {
  sequelize,
  modelName: 'Superficie',
  tableName: 'superficie',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default SuperficieModel;