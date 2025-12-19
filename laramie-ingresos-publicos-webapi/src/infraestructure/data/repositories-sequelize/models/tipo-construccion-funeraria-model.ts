import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoConstruccionFunerariaSchema from './tipo-construccion-funeraria-schema';

const sequelize = createConnection(true);

class TipoConstruccionFunerariaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("conVencimiento"),
		this.getDataValue("plazoMaxConcesion"),
		this.getDataValue("terminoConcesion1"),
		this.getDataValue("terminoConcesion2"),
		this.getDataValue("plazoMaxRenovacion"),
		this.getDataValue("terminoRenovacion1"),
		this.getDataValue("terminoRenovacion2")
	];

}

TipoConstruccionFunerariaModel.init(TipoConstruccionFunerariaSchema, {
  sequelize,
  modelName: 'TipoConstruccionFuneraria',
  tableName: 'tipo_construccion_funeraria',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoConstruccionFunerariaModel;
