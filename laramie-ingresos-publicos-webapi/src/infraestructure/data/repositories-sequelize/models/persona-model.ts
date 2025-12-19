import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CertificadoEscribanoModel from './certificado-escribano-model';
import PersonaSchema from './persona-schema';

const sequelize = createConnection(true);

class PersonaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoPersona"),
		this.getDataValue("nombrePersona"),
		this.getDataValue("idTipoDocumento"),
		this.getDataValue("numeroDocumento")
	];

}

PersonaModel.init(PersonaSchema, {
  sequelize,
  modelName: 'Persona',
  tableName: 'persona',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

// PersonaModel.hasMany(CertificadoEscribanoModel, { as: 'personaIntermediario', foreignKey: 'idPersonaIntermediario'});
// PersonaModel.hasMany(CertificadoEscribanoModel, { as: 'personaRetiro', foreignKey: 'idPersonaRetiro'});

export default PersonaModel;
