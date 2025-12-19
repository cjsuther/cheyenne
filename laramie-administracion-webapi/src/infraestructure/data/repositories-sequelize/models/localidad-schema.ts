import { DataTypes } from 'sequelize';

const LocalidadSchema = {
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
	idProvincia: {
		field: 'id_provincia',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default LocalidadSchema;
