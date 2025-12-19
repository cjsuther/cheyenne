import { DataTypes } from 'sequelize';

const CategoriaVehiculoSchema = {
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
	idIncisoVehiculo: {
		field: 'id_inciso_vehiculo',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	limiteInferior: {
		field: 'limite_inferior',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	limiteSuperior: {
		field: 'limite_superior',
		type: DataTypes.INTEGER,
		allowNull: false
	}
};

export default CategoriaVehiculoSchema;
