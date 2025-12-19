import { DataTypes } from 'sequelize';

const CajaAsignacionSchema = {
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
	idUsuario: {
		field: 'id_usuario',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaApertura: {
		field: 'fecha_apertura',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaCierre: {
		field: 'fecha_cierre',
		type: DataTypes.DATE,
		allowNull: true
	},
	importeSaldoInicial: {
		field: 'importe_saldo_inicial',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeSaldoFinal: {
		field: 'importe_saldo_final',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeCobro: {
		field: 'importe_cobro',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeCobroEfectivo: {
		field: 'importe_cobro_efectivo',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	idRecaudacionLote: {
		field: 'id_recaudacion_lote',
		type: DataTypes.BIGINT,
		allowNull: true
	}
};

export default CajaAsignacionSchema;
