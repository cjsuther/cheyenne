import { DataTypes } from 'sequelize';

const PlanPagoDefinicionAlcanceGrupoSchema = {
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
	idGrupo: {
		field: 'id_grupo',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PlanPagoDefinicionAlcanceGrupoSchema;
