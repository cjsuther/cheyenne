import { DataTypes } from 'sequelize';

const CertificadoEscribanoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	anioCertificado: {
		field: 'anio_certificado',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	numeroCertificado: {
		field: 'numero_certificado',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	idTipoCertificado: {
		field: 'id_tipo_certificado',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idObjetoCertificado: {
		field: 'id_objeto_certificado',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEscribano: {
		field: 'id_escribano',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	transferencia: {
		field: 'transferencia',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	vendedor: {
		field: 'vendedor',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	partida: {
		field: 'partida',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	direccion: {
		field: 'direccion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idPersonaIntermediario: {
		field: 'id_persona_intermediario',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idPersonaRetiro: {
		field: 'id_persona_retiro',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaEntrada: {
		field: 'fecha_entrada',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaSalida: {
		field: 'fecha_salida',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaEntrega: {
		field: 'fecha_entrega',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default CertificadoEscribanoSchema;
