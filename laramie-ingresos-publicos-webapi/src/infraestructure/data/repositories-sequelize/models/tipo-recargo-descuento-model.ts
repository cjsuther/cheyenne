import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoRecargoDescuentoSchema from './tipo-recargo-descuento-schema';

const sequelize = createConnection(true);

class TipoRecargoDescuentoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("orden"),
		this.getDataValue("tipo"),
		this.getDataValue("idTipoTributo"),
		parseFloat(this.getDataValue("porcentaje")),
		parseFloat(this.getDataValue("importe")),
		this.getDataValue("emiteSolicitud"),
		this.getDataValue("requiereOtrogamiento"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta"),
		this.getDataValue("procedimiento")
	];

}

TipoRecargoDescuentoModel.init(TipoRecargoDescuentoSchema, {
  sequelize,
  modelName: 'TipoRecargoDescuento',
  tableName: 'tipo_recargo_descuento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoRecargoDescuentoModel;
