import { DataTypes } from 'sequelize';

const ZonaGeoreferenciaSchema = {
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
	idLocalidad: {
		field: 'id_localidad',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	longitud: {
		field: 'longitud',
		type: DataTypes.DOUBLE,
		allowNull: false
	},
	latitud: {
		field: 'latitud',
		type: DataTypes.DOUBLE,
		allowNull: false
	}
};

export default ZonaGeoreferenciaSchema;
