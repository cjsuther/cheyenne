import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ObservacionSchema from './observacion-schema';

const sequelize = createConnection(true);

class ObservacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("entidad"),
		this.getDataValue("idEntidad"),
		this.getDataValue("detalle"),
    this.getDataValue("idUsuario"),
    this.getDataValue("fecha")
	];

}

ObservacionModel.init(ObservacionSchema, {
  sequelize,
  modelName: 'Observacion',
  tableName: 'observacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ObservacionModel;
