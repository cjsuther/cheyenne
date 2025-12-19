import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ControladorCuentaModel from './controlador-cuenta-model';
import ControladorModel from './controlador-model';
import TipoControladorSchema from './tipo-controlador-schema';

const sequelize = createConnection(true);

class TipoControladorModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("esSupervisor"),
		this.getDataValue("email"),
		this.getDataValue("direccion"),
		this.getDataValue("abogado"),
		this.getDataValue("oficialJusticia")

	];

}

TipoControladorModel.init(TipoControladorSchema, {
  sequelize,
  modelName: 'TipoControlador',
  tableName: 'tipo_controlador',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

TipoControladorModel.hasMany(ControladorModel, { as: 'controlador', foreignKey: 'idTipoControlador' });
ControladorModel.belongsTo(TipoControladorModel, { as: 'tipoControlador', foreignKey: 'idTipoControlador' });

TipoControladorModel.hasMany(ControladorCuentaModel, { as: 'controladorCuenta', foreignKey: 'idTipoControlador' });
ControladorCuentaModel.belongsTo(TipoControladorModel, { as: 'tipoControlador', foreignKey: 'idTipoControlador' });

export default TipoControladorModel;
