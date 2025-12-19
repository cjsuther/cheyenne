import { DataTypes } from 'sequelize';

const PlanPagoDefinicionInteresSchema = {
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
	porcentajeInteres: {
		field: 'porcentaje_interes',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default PlanPagoDefinicionInteresSchema;
