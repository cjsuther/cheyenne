import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PagoContadoDefinicionAlcanceRubroAfipSchema from './pago-contado-definicion-alcance-rubro-afip-schema';

const sequelize = createConnection(true);

class PagoContadoDefinicionAlcanceRubroAfipModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPagoContadoDefinicion"),
		this.getDataValue("idRubroAfip")
	];

}

PagoContadoDefinicionAlcanceRubroAfipModel.init(PagoContadoDefinicionAlcanceRubroAfipSchema, {
  sequelize,
  modelName: 'PagoContadoDefinicionAlcanceRubroAfip',
  tableName: 'pago_contado_definicion_alcance_rubro_afip',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PagoContadoDefinicionAlcanceRubroAfipModel;
