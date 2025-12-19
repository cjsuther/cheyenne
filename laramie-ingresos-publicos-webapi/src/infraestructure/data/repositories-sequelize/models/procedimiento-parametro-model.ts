import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ProcedimientoParametroSchema from './procedimiento-parametro-schema';

const sequelize = createConnection(true);

class ProcedimientoParametroModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idProcedimiento"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("tipoDato"),
		this.getDataValue("orden")
	];

}

ProcedimientoParametroModel.init(ProcedimientoParametroSchema, {
  sequelize,
  modelName: 'ProcedimientoParametro',
  tableName: 'procedimiento_parametro',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ProcedimientoParametroModel;
