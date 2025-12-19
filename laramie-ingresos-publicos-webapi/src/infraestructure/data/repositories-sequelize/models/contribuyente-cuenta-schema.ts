import { DataTypes } from 'sequelize';

const ContribuyenteCuentaSchema = {
	idContribuyente: {
		field: 'id_contribuyente',
		type: DataTypes.BIGINT,
		primaryKey: true,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		primaryKey: true,
		allowNull: false
	}
};

export default ContribuyenteCuentaSchema;
