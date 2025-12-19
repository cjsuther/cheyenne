import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ProcesoProgramacionSchema from './proceso-programacion-schema';

const sequelize = createConnection(true);

class ProcesoProgramacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("entidad"),
		this.getDataValue("descripcion"),
		this.getDataValue("urlEjecucion"),
		this.getDataValue("idTipoProgramacion"),
		this.getDataValue("diasProgramacion"),
		this.getDataValue("fechaUltimaProgramacion"),
		this.getDataValue("activa")
	];

}

ProcesoProgramacionModel.init(ProcesoProgramacionSchema, {
  sequelize,
  modelName: 'ProcesoProgramacion',
  tableName: 'proceso_programacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ProcesoProgramacionModel;
