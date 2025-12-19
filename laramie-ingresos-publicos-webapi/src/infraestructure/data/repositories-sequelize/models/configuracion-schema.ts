import { DataTypes } from 'sequelize';

const ConfiguracionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	nombre: {
		field: 'nombre',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	valor: {
		field: 'valor',
		type: DataTypes.STRING(1000),
		allowNull: false
	}
};

export default ConfiguracionSchema;
