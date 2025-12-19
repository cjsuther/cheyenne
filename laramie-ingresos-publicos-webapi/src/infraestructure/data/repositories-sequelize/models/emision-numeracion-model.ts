import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionNumeracionSchema from './emision-numeracion-schema';

const sequelize = createConnection(true);

class EmisionNumeracionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("nombre"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("valorProximo"),
		this.getDataValue("valorReservadoDesde"),
		this.getDataValue("valorReservadoHasta"),
		this.getDataValue("idEmisionEjecucionBloqueo")
	];

}

EmisionNumeracionModel.init(EmisionNumeracionSchema, {
  sequelize,
  modelName: 'EmisionNumeracion',
  tableName: 'emision_numeracion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionNumeracionModel;
