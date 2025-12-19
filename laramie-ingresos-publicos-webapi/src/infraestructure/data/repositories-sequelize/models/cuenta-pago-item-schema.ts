import { DataTypes } from 'sequelize';

const CuentaPagoItemSchema = {
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
	idEmisionConceptoResultado: {
		field: 'id_emision_concepto_resultado',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idPlanPagoCuota: {
		field: 'id_plan_pago_cuota',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idCuentaPago: {
		field: 'id_cuenta_pago',
		type: DataTypes.BIGINT,
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
	importeRecargos: {
		field: 'importe_recargos',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeMultas: {
		field: 'importe_multas',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeHonorarios: {
		field: 'importe_honorarios',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeAportes: {
		field: 'importe_aportes',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeTotal: {
		field: 'importe_total',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeNeto: {
		field: 'importe_neto',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeDescuento: {
		field: 'importe_descuento',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	fechaVencimientoTermino: {
		field: 'fecha_vencimiento_termino',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaCobro: {
		field: 'fecha_cobro',
		type: DataTypes.DATE,
		allowNull: true
	},
	idEdesurCliente: {
		field: 'id_edesur_cliente',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	item: {
		field: 'item',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	numeroPartida: {
		field: 'numero_partida',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default CuentaPagoItemSchema;
