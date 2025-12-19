import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import { hooksConfig } from './hooks-model';
import EtiquetaSchema from './etiqueta-schema';

const sequelize = createConnection(true);

class EtiquetaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("entidad"),
		this.getDataValue("idEntidad"),
		this.getDataValue("codigo")
	];

}

EtiquetaModel.init(EtiquetaSchema, {
  sequelize,
  hooks: hooksConfig,
  modelName: 'Etiqueta',
  tableName: 'etiqueta',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EtiquetaModel;
