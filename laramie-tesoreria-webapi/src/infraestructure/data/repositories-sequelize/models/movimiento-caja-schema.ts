import { DataTypes } from 'sequelize';

const MovimientoCajaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idCaja: {
		field: 'id_caja',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCajaAsignacion: {
		field: 'id_caja_asignacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoMovimientoCaja: {
		field: 'id_tipo_movimiento_caja',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	importeCobro: {
		field: 'importe_cobro',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	fechaCobro: {
		field: 'fecha_cobro',
		type: DataTypes.DATE,
		allowNull: false
	},
	observacion: {
		field: 'observacion',
		type: DataTypes.STRING(1000),
		allowNull: false
	}
};

export default MovimientoCajaSchema;
