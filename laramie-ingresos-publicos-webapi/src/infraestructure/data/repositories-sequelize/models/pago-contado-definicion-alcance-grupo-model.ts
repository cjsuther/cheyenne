import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PagoContadoDefinicionAlcanceGrupoSchema from './pago-contado-definicion-alcance-grupo-schema';

const sequelize = createConnection(true);

class PagoContadoDefinicionAlcanceGrupoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPagoContadoDefinicion"),
		this.getDataValue("idGrupo")
	];

}

PagoContadoDefinicionAlcanceGrupoModel.init(PagoContadoDefinicionAlcanceGrupoSchema, {
  sequelize,
  modelName: 'PagoContadoDefinicionAlcanceGrupo',
  tableName: 'pago_contado_definicion_alcance_grupo',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PagoContadoDefinicionAlcanceGrupoModel;
