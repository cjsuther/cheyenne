import { DataTypes } from 'sequelize';

const EmisionImputacionContableResultadoSchema = {
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
	idEmisionImputacionContable: {
		field: 'id_emision_imputacion_contable',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEmisionCuota: {
		field: 'id_emision_cuota',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idEstadoEmisionImputacionContableResultado: {
		field: 'id_estado_emision_imputacion_contable_resultado',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	valorPorcentaje: {
		field: 'valor_porcentaje',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	observacion: {
		field: 'observacion',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default EmisionImputacionContableResultadoSchema;
