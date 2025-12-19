import { DataTypes } from 'sequelize';

const CuentaCorrienteCondicionEspecialSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	idTipoCondicionEspecial: {
		field: 'id_tipo_condicion_especial',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	codigoDelegacion: {
		field: 'codigo_delegacion',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	numeroMovimiento: {
		field: 'numero_movimiento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroPartida: {
		field: 'numero_partida',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroComprobante: {
		field: 'numero_comprobante',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaDesde: {
		field: 'fecha_desde',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaHasta: {
		field: 'fecha_hasta',
		type: DataTypes.DATE,
		allowNull: false
	}
};

export default CuentaCorrienteCondicionEspecialSchema;
