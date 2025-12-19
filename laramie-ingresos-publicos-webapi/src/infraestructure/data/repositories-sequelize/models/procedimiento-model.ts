import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ProcedimientoSchema from './procedimiento-schema';
import ProcedimientoParametroModel from './procedimiento-parametro-model';
import ProcedimientoVariableModel from './procedimiento-variable-model';
import ProcedimientoFiltroModel from './procedimiento-filtro-model';

const sequelize = createConnection(true);

class ProcedimientoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEstadoProcedimiento"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("nombre"),
		this.getDataValue("descripcion"),
		this.getDataValue("idUsuarioCreacion"),
		this.getDataValue("fechaCreacion")
	];

}

ProcedimientoModel.init(ProcedimientoSchema, {
  sequelize,
  modelName: 'Procedimiento',
  tableName: 'procedimiento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

ProcedimientoModel.hasMany(ProcedimientoParametroModel, { as: 'procedimientoParametro', foreignKey: 'idProcedimiento' });
ProcedimientoModel.hasMany(ProcedimientoVariableModel, { as: 'procedimientoVariable', foreignKey: 'idProcedimiento' });
ProcedimientoModel.hasMany(ProcedimientoFiltroModel, { as: 'procedimientoFiltro', foreignKey: 'idProcedimiento' });

export default ProcedimientoModel;
