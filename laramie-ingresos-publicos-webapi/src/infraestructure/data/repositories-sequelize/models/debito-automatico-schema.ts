import { DataTypes } from 'sequelize';

const DebitoAutomaticoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
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
	idTipoSolicitudDebitoAutomatico: {
		field: 'id_tipo_solicitud_debito_automatico',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	numeroSolicitudDebitoAutomatico: {
		field: 'numero_solicitud_debito_automatico',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idMedioPago: {
		field: 'id_medio_pago',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	detalleMedioPago: {
		field: 'detalle_medio_pago',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	fechaDesde: {
		field: 'fecha_desde',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaAlta: {
		field: 'fecha_alta',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaBaja: {
		field: 'fecha_baja',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default DebitoAutomaticoSchema;
