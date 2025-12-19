import { DataTypes } from 'sequelize';

const CertificadoApremioPersonaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idCertificadoApremio: {
		field: 'id_certificado_apremio',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoRelacionCertificadoApremioPersona: {
		field: 'id_tipo_relacion_certificado_apremio_persona',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaDesde: {
		field: 'fecha_desde',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaHasta: {
		field: 'fecha_hasta',
		type: DataTypes.DATE,
		allowNull: true
	},
	idPersona: {
		field: 'id_persona',
		type: DataTypes.BIGINT,
		allowNull: false
	},
};

export default CertificadoApremioPersonaSchema;
