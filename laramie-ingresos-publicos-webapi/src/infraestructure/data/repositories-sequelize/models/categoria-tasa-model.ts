import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CategoriaTasaSchema from './categoria-tasa-schema';

const sequelize = createConnection(true);

class CategoriaTasaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("esPlan"),
		this.getDataValue("esDerechoEspontaneo")
	];

}

CategoriaTasaModel.init(CategoriaTasaSchema, {
  sequelize,
  modelName: 'CategoriaTasa',
  tableName: 'categoria_tasa',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CategoriaTasaModel;
