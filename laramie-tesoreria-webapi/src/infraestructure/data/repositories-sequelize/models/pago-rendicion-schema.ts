import { DataTypes } from 'sequelize';

const PagoRendicionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idPagoRendicionLote: {
		field: 'id_pago_rendicion_lote',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuentaPago: {
		field: 'id_cuenta_pago',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	codigoDelegacion: {
		field: 'codigo_delegacion',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	numeroRecibo: {
		field: 'numero_recibo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	codigoLugarPago: {
		field: 'codigo_lugar_pago',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	importePago: {
		field: 'importe_pago',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	fechaPago: {
		field: 'fecha_pago',
		type: DataTypes.DATE,
		allowNull: false
	},
	codigoBarras: {
		field: 'codigo_barras',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default PagoRendicionSchema;
