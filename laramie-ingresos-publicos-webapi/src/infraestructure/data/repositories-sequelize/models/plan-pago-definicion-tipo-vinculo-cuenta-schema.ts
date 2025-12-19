import { DataTypes } from 'sequelize';

const PlanPagoDefinicionTipoVinculoCuentaSchema = {
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
	idTipoVinculoCuenta: {
		field: 'id_tipo_vinculo_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PlanPagoDefinicionTipoVinculoCuentaSchema;
