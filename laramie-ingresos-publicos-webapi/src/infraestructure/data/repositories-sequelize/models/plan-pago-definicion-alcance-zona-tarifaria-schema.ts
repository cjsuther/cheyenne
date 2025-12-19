import { DataTypes } from 'sequelize';

const PlanPagoDefinicionAlcanceZonaTarifariaSchema = {
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
	idZonaTarifaria: {
		field: 'id_zona_tarifaria',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PlanPagoDefinicionAlcanceZonaTarifariaSchema;
