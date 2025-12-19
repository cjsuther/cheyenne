import { DataTypes } from 'sequelize';

const PlanPagoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTipoPlanPago: {
		field: 'id_tipo_plan_pago',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoTributo: {
		field: 'id_tipo_tributo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasaPlanPago: {
		field: 'id_sub_tasa_plan_pago',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasaInteres: {
		field: 'id_sub_tasa_interes',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasaSellados: {
		field: 'id_sub_tasa_sellados',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasaGastosCausidicos: {
		field: 'id_sub_tasa_gastos_causidicos',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	codigo: {
		field: 'codigo',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idPlanPagoDefinicion: {
		field: 'id_plan_pago_definicion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTributo: {
		field: 'id_tributo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoVinculoCuenta: {
		field: 'id_tipo_vinculo_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idVinculoCuenta: {
		field: 'id_vinculo_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	importeNominal: {
		field: 'importe_nominal',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeAccesorios: {
		field: 'importe_accesorios',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeCapital: {
		field: 'importe_capital',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeIntereses: {
		field: 'importe_intereses',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeSellados: {
		field: 'importe_sellados',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeGastosCausidicos: {
		field: 'importe_gastos_causidicos',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeQuita: {
		field: 'importe_quita',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeQuitaDevengar: {
		field: 'importe_quita_devengar',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importePlanPago: {
		field: 'importe_plan_pago',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	idUsuarioFirmante: {
		field: 'id_usuario_firmante',
		type: DataTypes.BIGINT,
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

export default PlanPagoSchema;
