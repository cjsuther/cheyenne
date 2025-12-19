import { DataTypes } from 'sequelize';

const RelacionCuentaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idCuenta1: {
		field: 'id_cuenta_1',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuenta2: {
		field: 'id_cuenta_2',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default RelacionCuentaSchema;
