import { DataTypes } from 'sequelize';

const EmisionConceptoSchema = {
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
	formulaImporteTotal: {
		field: 'formula_importe_total',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	formulaImporteNeto: {
		field: 'formula_importe_neto',
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

export default EmisionConceptoSchema;
