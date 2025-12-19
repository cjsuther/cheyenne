import { DataTypes } from 'sequelize';

const CertificadoApremioSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idApremio: {
		field: 'id_apremio',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idEstadoCertificadoApremio: {
		field: 'id_estado_certificado_apremio',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idInspeccion: {
		field: 'id_inspeccion',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	montoTotal: {
		field: 'monto_total',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	fechaCertificado: {
		field: 'fecha_certificado',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaCalculo: {
		field: 'fecha_calculo',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaNotificacion: {
		field: 'fecha_notificacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaRecepcion: {
		field: 'fecha_recepcion',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default CertificadoApremioSchema;
