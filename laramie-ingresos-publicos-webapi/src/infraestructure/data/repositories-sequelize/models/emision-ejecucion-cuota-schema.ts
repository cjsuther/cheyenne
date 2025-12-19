import { DataTypes } from 'sequelize';

const EmisionEjecucionCuotaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idEmisionEjecucion: {
		field: 'id_emision_ejecucion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEmisionEjecucionCuenta: {
		field: 'id_emision_ejecucion_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEmisionCuota: {
		field: 'id_emision_cuota',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idPlanPagoCuota: {
		field: 'id_plan_pago_cuota',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	numeroRecibo: {
		field: 'numero_recibo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	codigoBarras: {
		field: 'codigo_barras',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	orden: {
		field: 'orden',
		type: DataTypes.INTEGER,
		allowNull: false
	}
};

export default EmisionEjecucionCuotaSchema;
