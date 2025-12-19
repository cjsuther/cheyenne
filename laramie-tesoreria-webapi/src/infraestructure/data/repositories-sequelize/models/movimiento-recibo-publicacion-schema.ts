import { DataTypes } from 'sequelize';

const MovimientoReciboPublicacionSchema = {
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
	idReciboPublicacion: {
		field: 'id_recibo_publicacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	importeCobro: {
		field: 'importe_cobro',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default MovimientoReciboPublicacionSchema;
