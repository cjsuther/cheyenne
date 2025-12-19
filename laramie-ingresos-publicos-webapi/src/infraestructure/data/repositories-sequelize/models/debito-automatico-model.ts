import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import DebitoAutomaticoSchema from './debito-automatico-schema';

const sequelize = createConnection(true);

class DebitoAutomaticoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCuenta"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("idRubro"),
		this.getDataValue("idTipoSolicitudDebitoAutomatico"),
		this.getDataValue("numeroSolicitudDebitoAutomatico"),
		this.getDataValue("idMedioPago"),
		this.getDataValue("detalleMedioPago"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaAlta"),
		this.getDataValue("fechaBaja")
	];

}

DebitoAutomaticoModel.init(DebitoAutomaticoSchema, {
  sequelize,
  modelName: 'DebitoAutomatico',
  tableName: 'debito_automatico',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default DebitoAutomaticoModel;
