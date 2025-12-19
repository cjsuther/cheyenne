import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ReciboAperturaSchema from './recibo-apertura-schema';

const sequelize = createConnection(true);

class ReciboAperturaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idReciboPublicacion"),
		this.getDataValue("codigoRubro"),
		this.getDataValue("codigoTasa"),
		this.getDataValue("codigoSubTasa"),
		this.getDataValue("codigoTipoMovimiento"),
		this.getDataValue("periodo"),
		this.getDataValue("cuota"),
		parseFloat(this.getDataValue("importeCancelar")),
		parseFloat(this.getDataValue("importeImputacionContable")),
		this.getDataValue("numeroCertificadoApremio"),
		this.getDataValue("vencimiento"),
		this.getDataValue("fechaVencimiento"),
		this.getDataValue("numeroEmision"),
		this.getDataValue("tipoNovedad")
	];

}

ReciboAperturaModel.init(ReciboAperturaSchema, {
  sequelize,
  modelName: 'ReciboApertura',
  tableName: 'recibo_apertura',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ReciboAperturaModel;
