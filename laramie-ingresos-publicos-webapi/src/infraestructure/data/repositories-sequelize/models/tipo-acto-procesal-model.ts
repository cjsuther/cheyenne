import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoActoProcesalSchema from './tipo-acto-procesal-schema';

const sequelize = createConnection(true);

class TipoActoProcesalModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoActoProcesal"),
		this.getDataValue("codigoActoProcesal"),
		this.getDataValue("descripcion"),
		this.getDataValue("plazoDias"),
		parseFloat(this.getDataValue("porcentajeHonorarios")),
		this.getDataValue("fechaBaja"),
		this.getDataValue("nivel"),
		this.getDataValue("orden")
	];

}

TipoActoProcesalModel.init(TipoActoProcesalSchema, {
  sequelize,
  modelName: 'TipoActoProcesal',
  tableName: 'tipo_acto_procesal',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoActoProcesalModel;
