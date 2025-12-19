import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoCondicionEspecialSchema from './tipo-condicion-especial-schema';

const sequelize = createConnection(true);

class TipoCondicionEspecialModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("tipo"),
		this.getDataValue("color"),
		this.getDataValue("inhibicion")
	];

}

TipoCondicionEspecialModel.init(TipoCondicionEspecialSchema, {
  sequelize,
  modelName: 'TipoCondicionEspecial',
  tableName: 'tipo_condicion_especial',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoCondicionEspecialModel;
