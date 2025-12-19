import { DataTypes } from 'sequelize';

const MedioPagoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTipoPersona: {
		field: 'id_tipo_persona',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idPersona: {
		field: 'id_persona',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoMedioPago: {
		field: 'id_tipo_medio_pago',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	titular: {
		field: 'titular',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	banco: {
		field: 'banco',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	alias: {
		field: 'alias',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idTipoTarjeta: {
		field: 'id_tipo_tarjeta',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idMarcaTarjeta: {
		field: 'id_marca_tarjeta',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaVencimiento: {
		field: 'fecha_vencimiento',
		type: DataTypes.DATE,
		allowNull: true
	},
	cvv: {
		field: 'cvv',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default MedioPagoSchema;
