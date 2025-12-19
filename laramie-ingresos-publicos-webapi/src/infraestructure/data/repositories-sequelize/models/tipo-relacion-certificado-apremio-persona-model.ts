import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import TipoRelacionCertificadoApremioPersonaSchema from './tipo-relacion-certificado-apremio-persona-schema';

const sequelize = createConnection(true);

class TipoRelacionCertificadoApremioPersonaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("descripcion"),
		this.getDataValue("idTipoControlador")
	];

}

TipoRelacionCertificadoApremioPersonaModel.init(TipoRelacionCertificadoApremioPersonaSchema, {
  sequelize,
  modelName: 'TipoRelacionCertificadoApremioPersona',
  tableName: 'tipo_relacion_certificado_apremio_persona',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default TipoRelacionCertificadoApremioPersonaModel;
