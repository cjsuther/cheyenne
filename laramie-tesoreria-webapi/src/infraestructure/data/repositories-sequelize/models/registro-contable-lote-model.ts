import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import { hooksConfig } from './hooks-model';
import RegistroContableLoteSchema from './registro-contable-lote-schema';

const sequelize = createConnection(true);

class RegistroContableLoteModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("numeroLote"),
		this.getDataValue("fechaLote"),
		this.getDataValue("casos"),
		parseFloat(this.getDataValue("importeTotal")),
		this.getDataValue("idUsuarioProceso"),
		this.getDataValue("fechaProceso"),
		this.getDataValue("fechaConfirmacion"),
		this.getDataValue("pathArchivoRegistroContable")
	];

}

RegistroContableLoteModel.init(RegistroContableLoteSchema, {
  sequelize,
  hooks: hooksConfig,
  modelName: 'RegistroContableLote',
  tableName: 'registro_contable_lote',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default RegistroContableLoteModel;
