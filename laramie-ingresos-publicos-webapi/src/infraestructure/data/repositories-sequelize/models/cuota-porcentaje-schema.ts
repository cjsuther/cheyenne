import { DataTypes } from 'sequelize';

const CuotaPorcentajeSchema = {
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
		allowNull: true
	},
	idEmisionImputacionContableResultado: {
		field: 'id_emision_imputacion_contable_resultado',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTasa: {
		field: 'id_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasa: {
		field: 'id_sub_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	periodo: {
		field: 'periodo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	cuota: {
		field: 'cuota',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	idTasaPorcentaje: {
		field: 'id_tasa_porcentaje',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasaPorcentaje: {
		field: 'id_sub_tasa_porcentaje',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	porcentaje: {
		field: 'porcentaje',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importePorcentaje: {
		field: 'importe_porcentaje',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	ejercicio: {
		field: 'ejercicio',
		type: DataTypes.STRING(20),
		allowNull: false
	}
};

export default CuotaPorcentajeSchema;
