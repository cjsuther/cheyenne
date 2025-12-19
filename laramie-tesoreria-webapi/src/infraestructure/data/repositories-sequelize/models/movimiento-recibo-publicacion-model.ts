import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import { hooksConfig } from './hooks-model';
import MovimientoReciboPublicacionSchema from './movimiento-recibo-publicacion-schema';

const sequelize = createConnection(true);

class MovimientoReciboPublicacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idMovimientoCaja"),
		this.getDataValue("idReciboPublicacion"),
		parseFloat(this.getDataValue("importeCobro"))
	];

}

MovimientoReciboPublicacionModel.init(MovimientoReciboPublicacionSchema, {
  sequelize,
  hooks: hooksConfig,
  modelName: 'MovimientoReciboPublicacion',
  tableName: 'movimiento_recibo_publicacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default MovimientoReciboPublicacionModel;
