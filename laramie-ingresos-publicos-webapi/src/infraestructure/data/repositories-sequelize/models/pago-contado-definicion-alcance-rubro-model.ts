import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PagoContadoDefinicionAlcanceRubroSchema from './pago-contado-definicion-alcance-rubro-schema';

const sequelize = createConnection(true);

class PagoContadoDefinicionAlcanceRubroModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPagoContadoDefinicion"),
		this.getDataValue("idRubro")
	];

}

PagoContadoDefinicionAlcanceRubroModel.init(PagoContadoDefinicionAlcanceRubroSchema, {
  sequelize,
  modelName: 'PagoContadoDefinicionAlcanceRubro',
  tableName: 'pago_contado_definicion_alcance_rubro',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PagoContadoDefinicionAlcanceRubroModel;
