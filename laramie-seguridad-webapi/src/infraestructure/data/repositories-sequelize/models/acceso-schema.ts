import { DataTypes } from 'sequelize';

const AccesoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idUsuario: {
		field: 'id_usuario',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoAcceso: {
		field: 'id_tipo_acceso',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	identificador: {
		field: 'identificador',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	password: {
		field: 'password',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default AccesoSchema;
