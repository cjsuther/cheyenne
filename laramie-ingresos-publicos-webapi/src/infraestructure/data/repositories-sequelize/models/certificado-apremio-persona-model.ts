import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CertificadoApremioPersonaSchema from './certificado-apremio-persona-schema';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class CertificadoApremioPersonaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCertificadoApremio"),
		this.getDataValue("idTipoRelacionCertificadoApremioPersona"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta"),
		this.getDataValue("idPersona"),
		null, //idTipoPersona
		"", //nombrePersona
		null, //idTipoDocumento
		"", //numeroDocumento
		
		
	];

}

CertificadoApremioPersonaModel.init(CertificadoApremioPersonaSchema, {
  sequelize,
  modelName: 'CertificadoApremioPersona',
  tableName: 'certificado_apremio_persona',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

CertificadoApremioPersonaModel.belongsTo(PersonaModel, { as: 'persona', foreignKey: 'idPersona'});

export default CertificadoApremioPersonaModel;
