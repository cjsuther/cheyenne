import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PagoContadoDefinicionAlcanceZonaTarifariaSchema from './pago-contado-definicion-alcance-zona-tarifaria-schema';

const sequelize = createConnection(true);

class PagoContadoDefinicionAlcanceZonaTarifariaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPagoContadoDefinicion"),
		this.getDataValue("idZonaTarifaria")
	];

}

PagoContadoDefinicionAlcanceZonaTarifariaModel.init(PagoContadoDefinicionAlcanceZonaTarifariaSchema, {
  sequelize,
  modelName: 'PagoContadoDefinicionAlcanceZonaTarifaria',
  tableName: 'pago_contado_definicion_alcance_zona_tarifaria',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PagoContadoDefinicionAlcanceZonaTarifariaModel;
