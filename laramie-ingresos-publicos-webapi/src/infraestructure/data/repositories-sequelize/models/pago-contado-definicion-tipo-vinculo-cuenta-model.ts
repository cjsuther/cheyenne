import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PagoContadoDefinicionTipoVinculoCuentaSchema from './pago-contado-definicion-tipo-vinculo-cuenta-schema';

const sequelize = createConnection(true);

class PagoContadoDefinicionTipoVinculoCuentaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPagoContadoDefinicion"),
		this.getDataValue("idTipoVinculoCuenta")
	];

}

PagoContadoDefinicionTipoVinculoCuentaModel.init(PagoContadoDefinicionTipoVinculoCuentaSchema, {
  sequelize,
  modelName: 'PagoContadoDefinicionTipoVinculoCuenta',
  tableName: 'pago_contado_definicion_tipo_vinculo_cuenta',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PagoContadoDefinicionTipoVinculoCuentaModel;
