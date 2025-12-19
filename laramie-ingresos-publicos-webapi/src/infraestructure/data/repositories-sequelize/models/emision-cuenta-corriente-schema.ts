import { DataTypes } from 'sequelize';

const EmisionCuentaCorrienteSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idEmisionDefinicion: {
		field: 'id_emision_definicion',
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
	idTipoMovimiento: {
		field: 'id_tipo_movimiento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	tasaCabecera: {
		field: 'tasa_cabecera',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	formulaCondicion: {
		field: 'formula_condicion',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	formulaDebe: {
		field: 'formula_debe',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	formulaHaber: {
		field: 'formula_haber',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	vencimiento: {
		field: 'vencimiento',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	orden: {
		field: 'orden',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	soloLectura: {
		field: 'solo_lectura',
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};

export default EmisionCuentaCorrienteSchema;
