import { DataTypes } from 'sequelize';

const PlanPagoDefinicionQuitaCuotaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idPlanPagoDefinicion: {
		field: 'id_plan_pago_definicion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	cuotaDesde: {
		field: 'cuota_desde',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	cuotaHasta: {
		field: 'cuota_hasta',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	porcentajeQuitaRecargos: {
		field: 'porcentaje_quita_recargos',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	porcentajeQuitaMultaInfracciones: {
		field: 'porcentaje_quita_multa_infracciones',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	porcentajeQuitaHonorarios: {
		field: 'porcentaje_quita_honorarios',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	porcentajeQuitaAportes: {
		field: 'porcentaje_quita_aportes',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default PlanPagoDefinicionQuitaCuotaSchema;
