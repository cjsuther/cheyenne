import { DataTypes } from 'sequelize';

const PlanPagoCuotaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idPlanPago: {
		field: 'id_plan_pago',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEstadoPlanPagoCuota: {
		field: 'id_estado_plan_pago_cuota',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	esAnticipo: {
		field: 'es_anticipo',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.INTEGER,
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
	importeCuota: {
		field: 'importe_cuota',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	fechaVencimiento: {
		field: 'fecha_vencimiento',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaPagado: {
		field: 'fecha_pagado',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default PlanPagoCuotaSchema;
