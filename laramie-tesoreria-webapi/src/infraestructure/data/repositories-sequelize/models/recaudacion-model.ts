import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import RecaudacionSchema from './recaudacion-schema';

const sequelize = createConnection(true);

class RecaudacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idRecaudacionLote"),
		this.getDataValue("idReciboPublicacion"),
		this.getDataValue("idRegistroContableLote"),
		this.getDataValue("idPagoRendicionLote"),
		this.getDataValue("idRecaudadora"),
		this.getDataValue("numeroControl"),
		this.getDataValue("numeroComprobante"),
		this.getDataValue("codigoTipoTributo"),
		this.getDataValue("numeroCuenta"),
		this.getDataValue("codigoDelegacion"),
		this.getDataValue("numeroRecibo"),
		parseFloat(this.getDataValue("importeCobro")),
		this.getDataValue("fechaCobro"),
		this.getDataValue("codigoBarras"),
		this.getDataValue("idUsuarioConciliacion"),
		this.getDataValue("fechaConciliacion"),
		this.getDataValue("observacion")
	];

}

RecaudacionModel.init(RecaudacionSchema, {
  sequelize,
  modelName: 'Recaudacion',
  tableName: 'recaudacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default RecaudacionModel;
