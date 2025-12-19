import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ProcedimientoVariableSchema from './procedimiento-variable-schema';

const sequelize = createConnection(true);

class ProcedimientoVariableModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idProcedimiento"),
		this.getDataValue("idColeccionCampo"),
		this.getDataValue("idTipoVariable"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("tipoDato"),
		this.getDataValue("orden")
	];

}

ProcedimientoVariableModel.init(ProcedimientoVariableSchema, {
  sequelize,
  modelName: 'ProcedimientoVariable',
  tableName: 'procedimiento_variable',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ProcedimientoVariableModel;
