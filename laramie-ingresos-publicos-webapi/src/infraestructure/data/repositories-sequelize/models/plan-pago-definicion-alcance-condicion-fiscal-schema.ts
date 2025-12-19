import { DataTypes } from 'sequelize';

const PlanPagoDefinicionAlcanceCondicionFiscalSchema = {
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
	idCondicionFiscal: {
		field: 'id_condicion_fiscal',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PlanPagoDefinicionAlcanceCondicionFiscalSchema;
