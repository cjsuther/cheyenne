import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PagoContadoDefinicionAlcanceTasaSchema from './pago-contado-definicion-alcance-tasa-schema';

const sequelize = createConnection(true);

class PagoContadoDefinicionAlcanceTasaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPagoContadoDefinicion"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa")
	];

}

PagoContadoDefinicionAlcanceTasaModel.init(PagoContadoDefinicionAlcanceTasaSchema, {
  sequelize,
  modelName: 'PagoContadoDefinicionAlcanceTasa',
  tableName: 'pago_contado_definicion_alcance_tasa',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PagoContadoDefinicionAlcanceTasaModel;
