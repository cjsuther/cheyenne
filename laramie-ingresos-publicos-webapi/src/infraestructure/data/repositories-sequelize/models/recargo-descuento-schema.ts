import { DataTypes } from 'sequelize';

const RecargoDescuentoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	idTipoRecargoDescuento: {
		field: 'id_tipo_recargo_descuento',
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
	idRubro: {
		field: 'id_rubro',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaDesde: {
		field: 'fecha_desde',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaHasta: {
		field: 'fecha_hasta',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaOtorgamiento: {
		field: 'fecha_otorgamiento',
		type: DataTypes.DATE,
		allowNull: true
	},
	numeroSolicitud: {
		field: 'numero_solicitud',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	porcentaje: {
		field: 'porcentaje',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importe: {
		field: 'importe',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	idPersona: {
		field: 'id_persona',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroDDJJ: {
		field: 'numero_ddjj',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	letraDDJJ: {
		field: 'letra_ddjj',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	ejercicioDDJJ: {
		field: 'ejercicio_ddjj',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	numeroDecreto: {
		field: 'numero_decreto',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	letraDecreto: {
		field: 'letra_decreto',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	ejercicioDecreto: {
		field: 'ejercicio_decreto',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idExpediente: {
		field: 'id_expediente',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	detalleExpediente: {
		field: 'detalle_expediente',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default RecargoDescuentoSchema;