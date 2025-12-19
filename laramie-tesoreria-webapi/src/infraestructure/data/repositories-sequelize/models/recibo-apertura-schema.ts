import { DataTypes } from 'sequelize';

const ReciboAperturaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idReciboPublicacion: {
		field: 'id_recibo_publicacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	codigoRubro: {
		field: 'codigo_rubro',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	codigoTasa: {
		field: 'codigo_tasa',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	codigoSubTasa: {
		field: 'codigo_sub_tasa',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	codigoTipoMovimiento: {
		field: 'codigo_tipo_movimiento',
		type: DataTypes.STRING(50),
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
	importeCancelar: {
		field: 'importe_cancelar',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeImputacionContable: {
		field: 'importe_imputacion_contable',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	numeroCertificadoApremio: {
		field: 'numero_certificado_apremio',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	vencimiento: {
		field: 'vencimiento',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	fechaVencimiento: {
		field: 'fecha_vencimiento',
		type: DataTypes.DATE,
		allowNull: false
	},
	numeroEmision: {
		field: 'numero_emision',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	tipoNovedad: {
		field: 'tipo_novedad',
		type: DataTypes.STRING(20),
		allowNull: false
	}
};

export default ReciboAperturaSchema;
