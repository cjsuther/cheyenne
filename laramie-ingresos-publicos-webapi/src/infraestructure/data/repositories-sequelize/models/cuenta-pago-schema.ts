import { DataTypes } from 'sequelize';

const CuentaPagoSchema = {
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
	idPlanPago: {
		field: 'id_plan_pago',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	codigoDelegacion: {
		field: 'codigo_delegacion',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	numeroRecibo: {
		field: 'numero_recibo',
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
	importeVencimiento1: {
		field: 'importe_vencimiento1',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeVencimiento2: {
		field: 'importe_vencimiento2',
		type: DataTypes.DECIMAL(18,2),
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
		allowNull: true
	},
	codigoBarras: {
		field: 'codigo_barras',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	pagoAnticipado: {
		field: 'pago_anticipado',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	reciboEspecial: {
		field: 'recibo_especial',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
};

export default CuentaPagoSchema;
