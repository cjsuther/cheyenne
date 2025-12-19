import { DataTypes } from 'sequelize';

const TipoControladorSchema = {
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
	esSupervisor: {
		field: 'es_supervisor',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	email: {
		field: 'email',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	direccion: {
		field: 'direccion',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	abogado: {
		field: 'abogado',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	oficialJusticia: {
		field: 'oficial_justicia',
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};

export default TipoControladorSchema;
