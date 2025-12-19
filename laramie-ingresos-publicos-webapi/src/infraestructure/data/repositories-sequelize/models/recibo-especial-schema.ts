import { DataTypes } from 'sequelize';

const ReciboEspecialSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	codigo : {
		field: 'codigo',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	descripcion : {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	aplicaValorUF : {
		field: 'aplica_valor_uf',
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};

export default ReciboEspecialSchema;
