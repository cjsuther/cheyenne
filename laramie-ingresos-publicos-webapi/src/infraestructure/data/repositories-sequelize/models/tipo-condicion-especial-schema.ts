import { DataTypes } from 'sequelize';

const TipoCondicionEspecialSchema = {
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
	idTipoTributo: {
		field: 'id_tipo_tributo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	tipo: {
		field: 'tipo',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	color: {
		field: 'color',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	inhibicion: {
		field: 'inhibicion',
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};

export default TipoCondicionEspecialSchema;
