import { DataTypes } from 'sequelize';

const EmisionCuotaSchema = {
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
	cuota: {
		field: 'cuota',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	mes: {
		field: 'mes',
		type: DataTypes.INTEGER,
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
	anioDDJJ: {
		field: 'anio_ddjj',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	mesDDJJ: {
		field: 'mes_ddjj',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	fechaVencimiento1: {
		field: 'fecha_vencimiento1',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaVencimiento2: {
		field: 'fecha_vencimiento2',
		type: DataTypes.DATE,
		allowNull: false
	},
	orden: {
		field: 'orden',
		type: DataTypes.INTEGER,
		allowNull: false
	}
};

export default EmisionCuotaSchema;
