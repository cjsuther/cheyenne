import { DataTypes } from 'sequelize';

const JurisdiccionSchema = {
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
	ejercicio: {
		field: 'ejercicio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	agrupamiento: {
		field: 'agrupamiento',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	fecha: {
		field: 'fecha',
		type: DataTypes.DATE,
		allowNull: true
	},
	nivel: {
		field: 'nivel',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	tipo: {
		field: 'tipo',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default JurisdiccionSchema;
