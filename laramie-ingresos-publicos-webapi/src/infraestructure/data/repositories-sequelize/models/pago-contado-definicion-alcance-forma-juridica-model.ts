import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PagoContadoDefinicionAlcanceFormaJuridicaSchema from './pago-contado-definicion-alcance-forma-juridica-schema';

const sequelize = createConnection(true);

class PagoContadoDefinicionAlcanceFormaJuridicaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPagoContadoDefinicion"),
		this.getDataValue("idFormaJuridica")
	];

}

PagoContadoDefinicionAlcanceFormaJuridicaModel.init(PagoContadoDefinicionAlcanceFormaJuridicaSchema, {
  sequelize,
  modelName: 'PagoContadoDefinicionAlcanceFormaJuridica',
  tableName: 'pago_contado_definicion_alcance_forma_juridica',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PagoContadoDefinicionAlcanceFormaJuridicaModel;
