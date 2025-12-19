import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ColeccionCampoModel from './coleccion-campo-model';
import ColeccionSchema from './coleccion-schema';

const sequelize = createConnection(true);

class ColeccionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("nombre"),
		this.getDataValue("descripcion"),
		this.getDataValue("ejecucion")
	];

}

ColeccionModel.init(ColeccionSchema, {
  sequelize,
  modelName: 'Coleccion',
  tableName: 'coleccion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

ColeccionModel.hasMany(ColeccionCampoModel, { as: 'coleccionCampo', foreignKey: 'idColeccion' });

export default ColeccionModel;
