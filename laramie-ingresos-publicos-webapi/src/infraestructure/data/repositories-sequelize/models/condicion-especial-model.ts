import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CondicionEspecialSchema from './condicion-especial-schema';

const sequelize = createConnection(true);

class CondicionEspecialModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCuenta"),
		this.getDataValue("idTipoCondicionEspecial"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta")
	];

}

CondicionEspecialModel.init(CondicionEspecialSchema, {
  sequelize,
  modelName: 'CondicionEspecial',
  tableName: 'condicion_especial',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CondicionEspecialModel;