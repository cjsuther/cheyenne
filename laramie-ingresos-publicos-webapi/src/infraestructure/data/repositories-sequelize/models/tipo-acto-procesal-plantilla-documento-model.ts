import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoActoProcesalPlantillaDocumentoSchema from './tipo-acto-procesal-plantilla-documento-schema';
import TipoActoProcesalModel from './tipo-acto-procesal-model';
import PlantillaDocumentoModel from './plantilla-documento-model';


const sequelize = createConnection(true);

class TipoActoProcesalPlantillaDocumentoModel extends Model {

	getDataValues = () => [
		this.getDataValue("idTipoActoProcesal"),
		this.getDataValue("idPlantillaDocumento")
	];

}

TipoActoProcesalPlantillaDocumentoModel.init(TipoActoProcesalPlantillaDocumentoSchema, {
  sequelize,
  modelName: 'TipoActoProcesalPlantillaDocumento',
  tableName: 'tipo_acto_procesal_plantilla_documento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

TipoActoProcesalModel.hasMany(TipoActoProcesalPlantillaDocumentoModel, { as: 'tipoActoProcesalPlantillaDocumento', foreignKey: 'idTipoActoProcesal' });
PlantillaDocumentoModel.hasMany(TipoActoProcesalPlantillaDocumentoModel, { as: 'tipoActoProcesalPlantillaDocumento', foreignKey: 'idPlantillaDocumento' });

export default TipoActoProcesalPlantillaDocumentoModel;
