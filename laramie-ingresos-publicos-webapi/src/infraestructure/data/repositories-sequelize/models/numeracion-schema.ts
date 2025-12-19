import { DataTypes } from 'sequelize';

const NumeracionSchema = {
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
	valorProximo: {
		field: 'valor_proximo',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default NumeracionSchema;
