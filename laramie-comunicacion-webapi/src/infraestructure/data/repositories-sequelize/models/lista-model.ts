import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ListaSchema from './lista-schema';

const sequelize = createConnection(true);

class ListaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("tipo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

ListaModel.init(ListaSchema, {
  sequelize,
  modelName: 'Lista',
  tableName: 'lista',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ListaModel;
