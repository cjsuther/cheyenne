import { DataTypes } from 'sequelize';

const RubroLiquidacionSchema = {
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
	numera: {
		field: 'numera',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	reliquida: {
		field: 'reliquida',
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};

export default RubroLiquidacionSchema;
