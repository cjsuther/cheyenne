import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import RubroLiquidacionSchema from './rubro-liquidacion-schema';

const sequelize = createConnection(true);

class RubroLiquidacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("numera"),
		this.getDataValue("numero"),
		this.getDataValue("reliquida")
	];

}

RubroLiquidacionModel.init(RubroLiquidacionSchema, {
  sequelize,
  modelName: 'RubroLiquidacion',
  tableName: 'rubro_liquidacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default RubroLiquidacionModel;
