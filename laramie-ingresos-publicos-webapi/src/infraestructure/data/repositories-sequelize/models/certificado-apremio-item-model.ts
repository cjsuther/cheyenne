import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CertificadoApremioItemSchema from './certificado-apremio-item-schema';

const sequelize = createConnection(true);

class CertificadoApremioItemModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCertificadoApremio"),
		this.getDataValue("idCuentaCorrienteItem"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("periodo"),
		this.getDataValue("cuota"),
		parseFloat(this.getDataValue("monto")),
		parseFloat(this.getDataValue("montoRecargo")),
		parseFloat(this.getDataValue("montoTotal"))
	];

}

CertificadoApremioItemModel.init(CertificadoApremioItemSchema, {
  sequelize,
  modelName: 'CertificadoApremioItem',
  tableName: 'certificado_apremio_item',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CertificadoApremioItemModel;
