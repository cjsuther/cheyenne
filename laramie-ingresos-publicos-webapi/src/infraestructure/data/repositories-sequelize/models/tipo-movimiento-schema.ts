import { DataTypes } from 'sequelize';

const TipoMovimientoSchema = {
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
	actEmitido: {
		field: 'act_emitido',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	automatico: {
		field: 'automatico',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	autonumerado: {
		field: 'autonumerado',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	imputacion: {
		field: 'imputacion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	tipo: {
		field: 'tipo',
		type: DataTypes.STRING(20),
		allowNull: false
	}
};

export default TipoMovimientoSchema;
