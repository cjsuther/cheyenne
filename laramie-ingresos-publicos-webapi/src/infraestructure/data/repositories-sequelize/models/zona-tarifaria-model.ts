import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ZonaTarifariaSchema from './zona-tarifaria-schema';

const sequelize = createConnection(true);

class ZonaTarifariaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden")
	];

}

ZonaTarifariaModel.init(ZonaTarifariaSchema, {
  sequelize,
  modelName: 'ZonaTarifaria',
  tableName: 'zona_tarifaria',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ZonaTarifariaModel;
