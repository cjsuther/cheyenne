import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PagoContadoDefinicionAlcanceCondicionFiscalSchema from './pago-contado-definicion-alcance-condicion-fiscal-schema';

const sequelize = createConnection(true);

class PagoContadoDefinicionAlcanceCondicionFiscalModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPagoContadoDefinicion"),
		this.getDataValue("idCondicionFiscal")
	];

}

PagoContadoDefinicionAlcanceCondicionFiscalModel.init(PagoContadoDefinicionAlcanceCondicionFiscalSchema, {
  sequelize,
  modelName: 'PagoContadoDefinicionAlcanceCondicionFiscal',
  tableName: 'pago_contado_definicion_alcance_condicion_fiscal',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PagoContadoDefinicionAlcanceCondicionFiscalModel;
