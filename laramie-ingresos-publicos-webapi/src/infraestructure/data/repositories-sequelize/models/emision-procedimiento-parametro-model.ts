import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionProcedimientoParametroSchema from './emision-procedimiento-parametro-schema';

const sequelize = createConnection(true);

class EmisionProcedimientoParametroModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("idProcedimientoParametro"),
		this.getDataValue("valor")
	];

}

EmisionProcedimientoParametroModel.init(EmisionProcedimientoParametroSchema, {
  sequelize,
  modelName: 'EmisionProcedimientoParametro',
  tableName: 'emision_procedimiento_parametro',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionProcedimientoParametroModel;
