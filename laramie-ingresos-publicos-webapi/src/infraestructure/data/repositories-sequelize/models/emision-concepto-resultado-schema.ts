import { DataTypes } from 'sequelize';

const EmisionConceptoResultadoSchema = {
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
	idEmisionConcepto: {
		field: 'id_emision_concepto',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEmisionCuota: {
		field: 'id_emision_cuota',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idEstadoEmisionConceptoResultado: {
		field: 'id_estado_emision_concepto_resultado',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	valorImporteTotal: {
		field: 'valor_importe_total',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	valorImporteNeto: {
		field: 'valor_importe_neto',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	observacion: {
		field: 'observacion',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default EmisionConceptoResultadoSchema;
