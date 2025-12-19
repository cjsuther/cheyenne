import { DataTypes } from 'sequelize';

const CuentaPruebaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTipoTributo: {
		field: 'id_tipo_tributo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	comentario: {
		field: 'comentario',
		type: DataTypes.STRING(1000),
		allowNull: false
	}
};

export default CuentaPruebaSchema;
