import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import FiltroSchema from './filtro-schema';

const sequelize = createConnection(true);

class FiltroModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("ejecucion")
	];

}

FiltroModel.init(FiltroSchema, {
  sequelize,
  modelName: 'Filtro',
  tableName: 'filtro',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default FiltroModel;
