import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import { hooksConfig } from './hooks-model';
import ReciboPublicacionLoteSchema from './recibo-publicacion-lote-schema';

const sequelize = createConnection(true);

class ReciboPublicacionLoteModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("numeroLote"),
		this.getDataValue("fechaLote"),
		this.getDataValue("casos"),
		parseFloat(this.getDataValue("importeTotal1")),
		parseFloat(this.getDataValue("importeTotal2"))
	];

}

ReciboPublicacionLoteModel.init(ReciboPublicacionLoteSchema, {
  sequelize,
  hooks: hooksConfig,
  modelName: 'ReciboPublicacionLote',
  tableName: 'recibo_publicacion_lote',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ReciboPublicacionLoteModel;
