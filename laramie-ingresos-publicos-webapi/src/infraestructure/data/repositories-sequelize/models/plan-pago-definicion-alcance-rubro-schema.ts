import { DataTypes } from 'sequelize';

const PlanPagoDefinicionAlcanceRubroSchema = {
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
	idRubro: {
		field: 'id_rubro',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PlanPagoDefinicionAlcanceRubroSchema;
