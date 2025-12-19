import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CertificadoApremioSchema from './certificado-apremio-schema';

const sequelize = createConnection(true);

class CertificadoApremioModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idApremio"),
		this.getDataValue("idEstadoCertificadoApremio"),
		this.getDataValue("numero"),
		this.getDataValue("idCuenta"),
		this.getDataValue("idInspeccion"),
		parseFloat(this.getDataValue("montoTotal")),
		this.getDataValue("fechaCertificado"),
		this.getDataValue("fechaCalculo"),
		this.getDataValue("fechaNotificacion"),
		this.getDataValue("fechaRecepcion")
	];

}

CertificadoApremioModel.init(CertificadoApremioSchema, {
  sequelize,
  modelName: 'CertificadoApremio',
  tableName: 'certificado_apremio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CertificadoApremioModel;
