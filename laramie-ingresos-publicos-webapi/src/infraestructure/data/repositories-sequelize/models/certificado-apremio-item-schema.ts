import { DataTypes } from 'sequelize';

const CertificadoApremioItemSchema = {
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
	idCuentaCorrienteItem: {
		field: 'id_cuenta_corriente_item',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTasa: {
		field: 'id_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasa: {
		field: 'id_sub_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	periodo: {
		field: 'periodo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	cuota: {
		field: 'cuota',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	monto: {
		field: 'monto',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	montoRecargo: {
		field: 'monto_recargo',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	montoTotal: {
		field: 'monto_total',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default CertificadoApremioItemSchema;
