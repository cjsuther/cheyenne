import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ObjetoCertificadoSchema from './objeto-certificado-schema';

const sequelize = createConnection(true);

class ObjetoCertificadoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("actualizaPropietario")
	];

}

ObjetoCertificadoModel.init(ObjetoCertificadoSchema, {
  sequelize,
  modelName: 'ObjetoCertificado',
  tableName: 'objeto_certificado',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ObjetoCertificadoModel;
