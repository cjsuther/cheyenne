import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import { hooksConfig } from './hooks-model';
import RecaudacionLoteSchema from './recaudacion-lote-schema';

const sequelize = createConnection(true);

class RecaudacionLoteModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("numeroLote"),
		this.getDataValue("fechaLote"),
		this.getDataValue("casos"),
		this.getDataValue("idUsuarioProceso"),
		this.getDataValue("fechaProceso"),
		this.getDataValue("idOrigenRecaudacion"),
		this.getDataValue("idRecaudadora"),
		this.getDataValue("fechaAcreditacion"),
		this.getDataValue("idUsuarioControl"),
		this.getDataValue("fechaControl"),
		this.getDataValue("idUsuarioConciliacion"),
		this.getDataValue("fechaConciliacion"),
		parseFloat(this.getDataValue("importeTotal")),
		parseFloat(this.getDataValue("importeNeto")),
		this.getDataValue("pathArchivoRecaudacion"),
		this.getDataValue("nombreArchivoRecaudacion")
	];

}

RecaudacionLoteModel.init(RecaudacionLoteSchema, {
  sequelize,
  hooks: hooksConfig,
  modelName: 'RecaudacionLote',
  tableName: 'recaudacion_lote',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default RecaudacionLoteModel;
