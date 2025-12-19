import { DataTypes } from 'sequelize';

const ColeccionCampoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idColeccion: {
		field: 'id_coleccion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoVariable: {
		field: 'id_tipo_variable',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	campo: {
		field: 'campo',
		type: DataTypes.STRING(50),
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

export default ColeccionCampoSchema;
