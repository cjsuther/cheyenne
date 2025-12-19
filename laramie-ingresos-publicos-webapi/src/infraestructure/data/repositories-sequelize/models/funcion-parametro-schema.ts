import { DataTypes } from 'sequelize';

const FuncionParametroSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idFuncion: {
		field: 'id_funcion',
		type: DataTypes.BIGINT,
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
	tipoDato: {
		field: 'tipo_dato',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	orden: {
		field: 'orden',
		type: DataTypes.INTEGER,
		allowNull: false
	}
};

export default FuncionParametroSchema;
