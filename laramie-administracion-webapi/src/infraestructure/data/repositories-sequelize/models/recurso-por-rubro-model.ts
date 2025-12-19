import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import RecursoPorRubroSchema from './recurso-por-rubro-schema';

const sequelize = createConnection(true);

class RecursoPorRubroModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("presupuesto"),
		this.getDataValue("agrupamiento"),
		this.getDataValue("procedencia"),
		this.getDataValue("caracterEconomico"),
		this.getDataValue("nivel"),
		this.getDataValue("fechaBaja")
	];

}

RecursoPorRubroModel.init(RecursoPorRubroSchema, {
  sequelize,
  modelName: 'RecursoPorRubro',
  tableName: 'recurso_por_rubro',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default RecursoPorRubroModel;
