import { DataTypes } from 'sequelize';

const EmisionCalculoResultadoSchema = {
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
	idEmisionCalculo: {
		field: 'id_emision_calculo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEmisionCuota: {
		field: 'id_emision_cuota',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idEstadoEmisionCalculoResultado: {
		field: 'id_estado_emision_calculo_resultado',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	valor: {
		field: 'valor',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	observacion: {
		field: 'observacion',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default EmisionCalculoResultadoSchema;
