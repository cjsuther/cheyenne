import { DataTypes } from 'sequelize';

const VariableSchema = {
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
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idTipoTributo: {
		field: 'id_tipo_tributo',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	tipoDato: {
		field: 'tipo_dato',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	constante: {
		field: 'constante',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	predefinido: {
		field: 'predefinido',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	opcional: {
		field: 'opcional',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	activo: {
		field: 'activo',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	global: {
		field: 'global',
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};

export default VariableSchema;
