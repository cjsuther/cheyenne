import { DataTypes } from 'sequelize';

const RecaudacionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idRecaudacionLote: {
		field: 'id_recaudacion_lote',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idReciboPublicacion: {
		field: 'id_recibo_publicacion',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idRegistroContableLote: {
		field: 'id_registro_contable_lote',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idPagoRendicionLote: {
		field: 'id_pago_rendicion_lote',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idRecaudadora: {
		field: 'id_recaudadora',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroControl: {
		field: 'numero_control',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	numeroComprobante: {
		field: 'numero_comprobante',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	codigoTipoTributo: {
		field: 'codigo_tipo_tributo',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	numeroCuenta: {
		field: 'numero_cuenta',
		type: DataTypes.STRING(50),
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
	codigoBarras: {
		field: 'codigo_barras',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idUsuarioConciliacion: {
		field: 'id_usuario_conciliacion',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaConciliacion: {
		field: 'fecha_conciliacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	observacion: {
		field: 'observacion',
		type: DataTypes.STRING(1000),
		allowNull: false
	}
};

export default RecaudacionSchema;
