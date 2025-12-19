import { DataTypes } from 'sequelize';

const EmisionCuentaCorrienteResultadoSchema = {
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
	idEmisionCuentaCorriente: {
		field: 'id_emision_cuenta_corriente',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEmisionCuota: {
		field: 'id_emision_cuota',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idEstadoEmisionCuentaCorrienteResultado: {
		field: 'id_estado_emision_cuenta_corriente_resultado',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	valorDebe: {
		field: 'valor_debe',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	valorHaber: {
		field: 'valor_haber',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	observacion: {
		field: 'observacion',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default EmisionCuentaCorrienteResultadoSchema;
