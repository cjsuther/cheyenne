import { DataTypes } from 'sequelize';

const PlanPagoDefinicionAlcanceFormaJuridicaSchema = {
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
	idFormaJuridica: {
		field: 'id_forma_juridica',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PlanPagoDefinicionAlcanceFormaJuridicaSchema;
