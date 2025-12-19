import { DataTypes } from 'sequelize';

const FuncionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idCategoriaFuncion: {
		field: 'id_categoria_funcion',
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
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	tipoDato: {
		field: 'tipo_dato',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	modulo: {
		field: 'modulo',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default FuncionSchema;
