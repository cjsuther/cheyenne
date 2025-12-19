import { DataTypes } from 'sequelize';

const EmisionEjecucionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idEmisionDefinicion: {
		field: 'id_emision_definicion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEstadoEmisionEjecucion: {
		field: 'id_estado_emision_ejecucion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	descripcionAbreviada: {
		field: 'descripcion_abreviada',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	periodo: {
		field: 'periodo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	imprimeRecibosEmision: {
		field: 'imprime_recibos_emision',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	aplicaDebitoAutomatico: {
		field: 'aplica_debito_automatico',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	calculoMostradorWeb: {
		field: 'calculo_mostrador_web',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	calculoMasivo: {
		field: 'calculo_masivo',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	calculoPrueba: {
		field: 'calculo_prueba',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	calculoPagoAnticipado: {
		field: 'calculo_pago_anticipado',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	fechaPagoAnticipadoVencimiento1: {
		field: 'fecha_pago_anticipado_vencimiento1',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaPagoAnticipadoVencimiento2: {
		field: 'fecha_pago_anticipado_vencimiento2',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaEjecucionInicio: {
		field: 'fecha_ejecucion_inicio',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaEjecucionFin: {
		field: 'fecha_ejecucion_fin',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default EmisionEjecucionSchema;
