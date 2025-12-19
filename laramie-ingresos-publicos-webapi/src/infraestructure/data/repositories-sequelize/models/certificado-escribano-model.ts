import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CertificadoEscribanoSchema from './certificado-escribano-schema';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class CertificadoEscribanoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("anioCertificado"),
		this.getDataValue("numeroCertificado"),
		this.getDataValue("idTipoCertificado"),
		this.getDataValue("idObjetoCertificado"),
		this.getDataValue("idEscribano"),
		this.getDataValue("transferencia"),
		this.getDataValue("idCuenta"),
		this.getDataValue("vendedor"),
		this.getDataValue("partida"),
		this.getDataValue("direccion"),
		this.getDataValue("idPersonaIntermediario"),
		null, //idTipoPersona
		"", //nombrePersona
		null, //idTipoDocumento
		"", //numeroDocumento
		this.getDataValue("idPersonaRetiro"),
		null, //idTipoPersona
		"", //nombrePersona
		null, //idTipoDocumento
		"", //numeroDocumento
		this.getDataValue("fechaEntrada"),
		this.getDataValue("fechaSalida"),
		this.getDataValue("fechaEntrega")
	];

}

CertificadoEscribanoModel.init(CertificadoEscribanoSchema, {
  sequelize,
  modelName: 'CertificadoEscribano',
  tableName: 'certificado_escribano',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

CertificadoEscribanoModel.belongsTo(PersonaModel, { as: 'personaIntermediario', foreignKey: 'idPersonaIntermediario'});
CertificadoEscribanoModel.belongsTo(PersonaModel, { as: 'personaRetiro', foreignKey: 'idPersonaRetiro'});

export default CertificadoEscribanoModel;
