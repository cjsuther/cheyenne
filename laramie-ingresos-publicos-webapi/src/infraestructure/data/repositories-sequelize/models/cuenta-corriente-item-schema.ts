import { DataTypes } from 'sequelize';

const CuentaCorrienteItemSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idEmisionEjecucion: {
		field: 'id_emision_ejecucion',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idEmisionCuentaCorrienteResultado: {
		field: 'id_emision_cuenta_corriente_resultado',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idPlanPago: {
		field: 'id_plan_pago',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idPlanPagoCuota: {
		field: 'id_plan_pago_cuota',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idCertificadoApremio: {
		field: 'id_certificado_apremio',
		type: DataTypes.BIGINT,
		allowNull: true
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
	codigoDelegacion: {
		field: 'codigo_delegacion',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idTipoMovimiento: {
		field: 'id_tipo_movimiento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroMovimiento: {
		field: 'numero_movimiento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroPartida: {
		field: 'numero_partida',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	tasaCabecera: {
		field: 'tasa_cabecera',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	idTipoValor: {
		field: 'id_tipo_valor',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	importeDebe: {
		field: 'importe_debe',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeHaber: {
		field: 'importe_haber',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	idLugarPago: {
		field: 'id_lugar_pago',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaOrigen: {
		field: 'fecha_origen',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaMovimiento: {
		field: 'fecha_movimiento',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaVencimiento1: {
		field: 'fecha_vencimiento1',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaVencimiento2: {
		field: 'fecha_vencimiento2',
		type: DataTypes.DATE,
		allowNull: false
	},
	cantidad: {
		field: 'cantidad',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	idEdesurCliente: {
		field: 'id_edesur_cliente',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	detalle: {
		field: 'detalle',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	item: {
		field: 'item',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	idUsuarioRegistro: {
		field: 'id_usuario_registro',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaRegistro: {
		field: 'fecha_registro',
		type: DataTypes.DATE,
		allowNull: false
	}
};

export default CuentaCorrienteItemSchema;
