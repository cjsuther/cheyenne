import { DataTypes } from 'sequelize';

const RecursoPorRubroSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	codigo: {
		field: 'codigo',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	nombre: {
		field: 'nombre',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	orden: {
		field: 'orden',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	presupuesto: {
		field: 'presupuesto',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	agrupamiento: {
		field: 'agrupamiento',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	procedencia: {
		field: 'procedencia',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	caracterEconomico: {
		field: 'caracter_economico',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	nivel: {
		field: 'nivel',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	fechaBaja: {
		field: 'fecha_baja',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default RecursoPorRubroSchema;
