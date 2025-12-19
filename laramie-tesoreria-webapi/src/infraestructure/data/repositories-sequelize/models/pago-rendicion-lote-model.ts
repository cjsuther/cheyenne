import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import { hooksConfig } from './hooks-model';
import PagoRendicionLoteSchema from './pago-rendicion-lote-schema';

const sequelize = createConnection(true);

class PagoRendicionLoteModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("numeroLote"),
		this.getDataValue("fechaLote"),
		this.getDataValue("casos"),
		parseFloat(this.getDataValue("importeTotal")),
		this.getDataValue("idUsuarioProceso"),
		this.getDataValue("fechaProceso"),
		this.getDataValue("fechaConfirmacion")
	];

}

PagoRendicionLoteModel.init(PagoRendicionLoteSchema, {
  sequelize,
  hooks: hooksConfig,
  modelName: 'PagoRendicionLote',
  tableName: 'pago_rendicion_lote',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PagoRendicionLoteModel;
