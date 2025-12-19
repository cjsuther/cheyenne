import { DataTypes } from 'sequelize';

const ReciboPublicacionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idReciboPublicacionLote: {
		field: 'id_recibo_publicacion_lote',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuentaPago: {
		field: 'id_cuenta_pago',
		type: DataTypes.BIGINT,
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
	periodo: {
		field: 'periodo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	cuota: {
		field: 'cuota',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	importeVencimiento1: {
		field: 'importe_vencimiento1',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeVencimiento2: {
		field: 'importe_vencimiento2',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	fechaVencimiento1: {
		field: 'fecha_vencimiento1',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaVencimiento2: {
		field: 'fecha_vencimiento2',
		type: DataTypes.DATE,
		allowNull: false
	},
	codigoBarras: {
		field: 'codigo_barras',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idPagoRendicion: {
		field: 'id_pago_rendicion',
		type: DataTypes.BIGINT,
		allowNull: true
	}
};

export default ReciboPublicacionSchema;
