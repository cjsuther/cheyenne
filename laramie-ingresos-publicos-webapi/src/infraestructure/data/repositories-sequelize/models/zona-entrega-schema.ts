import { DataTypes } from 'sequelize';

const ZonaEntregaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoControlador: {
		field: 'id_tipo_controlador',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	email: {
		field: 'email',
		type: DataTypes.STRING(250),
		allowNull: false
	},
};

export default ZonaEntregaSchema;
