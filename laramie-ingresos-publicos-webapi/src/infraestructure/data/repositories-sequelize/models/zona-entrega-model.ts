import { Model, Op } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ZonaEntregaSchema from './zona-entrega-schema';
import DireccionModel from './direccion-model';

const sequelize = createConnection(true);

class ZonaEntregaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCuenta"),
		this.getDataValue("idTipoControlador"),
		this.getDataValue("email")
	];
}

ZonaEntregaModel.init(ZonaEntregaSchema, {
  sequelize,
  modelName: 'ZonaEntrega',
  tableName: 'zona_entrega',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

ZonaEntregaModel.hasMany(DireccionModel, { as: 'direccion', foreignKey: 'idEntidad', 
	scope: {[Op.and]: sequelize.where(sequelize.col("direccion.entidad"), Op.eq, "ZonaEntrega")}
});

export default ZonaEntregaModel;
