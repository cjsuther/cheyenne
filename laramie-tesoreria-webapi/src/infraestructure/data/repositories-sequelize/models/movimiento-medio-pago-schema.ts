import { DataTypes } from 'sequelize';

const MovimientoMedioPagoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idMovimientoCaja: {
		field: 'id_movimiento_caja',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idMedioPago: {
		field: 'id_medio_pago',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroMedioPago: {
		field: 'numero_medio_pago',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	bancoMedioPago: {
		field: 'banco_medio_pago',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	importeCobro: {
		field: 'importe_cobro',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default MovimientoMedioPagoSchema;
