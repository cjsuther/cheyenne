import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import MedioPagoSchema from './medio-pago-schema';

const sequelize = createConnection(true);

class MedioPagoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoPersona"),
		this.getDataValue("idPersona"),
		this.getDataValue("idTipoMedioPago"),
		this.getDataValue("titular"),
		this.getDataValue("numero"),
		this.getDataValue("banco"),
		this.getDataValue("alias"),
		this.getDataValue("idTipoTarjeta"),
		this.getDataValue("idMarcaTarjeta"),
		this.getDataValue("fechaVencimiento"),
		this.getDataValue("cvv")
	];

}

MedioPagoModel.init(MedioPagoSchema, {
  sequelize,
  modelName: 'MedioPago',
  tableName: 'medio_pago',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default MedioPagoModel;
