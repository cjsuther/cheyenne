import { DataTypes } from 'sequelize';

const EmisionImputacionContableSchema = {
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
	formulaPorcentaje: {
		field: 'formula_porcentaje',
		type: DataTypes.STRING(1000),
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

export default EmisionImputacionContableSchema;
