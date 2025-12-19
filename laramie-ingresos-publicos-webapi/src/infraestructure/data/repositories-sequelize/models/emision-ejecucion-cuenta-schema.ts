import { DataTypes } from 'sequelize';

const EmisionEjecucionCuentaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idEmisionEjecucion: {
		field: 'id_emision_ejecucion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEstadoEmisionEjecucionCuenta: {
		field: 'id_estado_emision_ejecucion_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroBloque: {
		field: 'numero_bloque',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	observacion: {
		field: 'observacion',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default EmisionEjecucionCuentaSchema;
