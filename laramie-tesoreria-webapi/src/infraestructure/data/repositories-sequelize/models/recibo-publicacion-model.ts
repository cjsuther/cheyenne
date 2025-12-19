import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ReciboPublicacionSchema from './recibo-publicacion-schema';

const sequelize = createConnection(true);

class ReciboPublicacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idReciboPublicacionLote"),
		this.getDataValue("idCuentaPago"),
		this.getDataValue("codigoTipoTributo"),
		this.getDataValue("numeroCuenta"),
		this.getDataValue("codigoDelegacion"),
		this.getDataValue("numeroRecibo"),
		this.getDataValue("periodo"),
		this.getDataValue("cuota"),
		parseFloat(this.getDataValue("importeVencimiento1")),
		parseFloat(this.getDataValue("importeVencimiento2")),
		this.getDataValue("fechaVencimiento1"),
		this.getDataValue("fechaVencimiento2"),
		this.getDataValue("codigoBarras"),
		this.getDataValue("idPagoRendicion")
	];

}

ReciboPublicacionModel.init(ReciboPublicacionSchema, {
  sequelize,
  modelName: 'ReciboPublicacion',
  tableName: 'recibo_publicacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ReciboPublicacionModel;
