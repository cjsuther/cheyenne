import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ProcedimientoFiltroSchema from './procedimiento-filtro-schema';

const sequelize = createConnection(true);

class ProcedimientoFiltroModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idProcedimiento"),
		this.getDataValue("idFiltro")
	];

}

ProcedimientoFiltroModel.init(ProcedimientoFiltroSchema, {
  sequelize,
  modelName: 'ProcedimientoFiltro',
  tableName: 'procedimiento_filtro',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ProcedimientoFiltroModel;
