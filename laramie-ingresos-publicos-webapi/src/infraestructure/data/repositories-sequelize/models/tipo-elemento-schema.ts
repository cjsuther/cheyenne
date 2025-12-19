import { DataTypes } from 'sequelize';

const TipoElementoSchema = {
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
	idClaseElemento: {
		field: 'id_clase_elemento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idUnidadMedida: {
		field: 'id_unidad_medida',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	valor: {
		field: 'valor',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default TipoElementoSchema;
