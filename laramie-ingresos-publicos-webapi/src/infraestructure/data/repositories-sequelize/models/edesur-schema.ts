import { DataTypes } from 'sequelize';

const EdesurSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idInmueble: {
		field: 'id_inmueble',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	ultPeriodoEdesur: {
		field: 'ult_periodo_edesur',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	ultCuotaEdesur: {
		field: 'ult_cuota_edesur',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	ultImporteEdesur: {
		field: 'ult_importe_edesur',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	medidor: {
		field: 'medidor',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idFrecuenciaFacturacion: {
		field: 'id_frecuencia_facturacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	plan: {
		field: 'plan',
		type: DataTypes.STRING(50),
		allowNull: true
	},
	radio: {
		field: 'radio',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	manzana: {
		field: 'manzana',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idAnteriorEdesur: {
		field: 'id_anterior_edesur',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	tarifa: {
		field: 'tarifa',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	tarifa1: {
		field: 'tarifa_1',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	claseServicio: {
		field: 'clase_servicio',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	porcDesc: {
		field: 'porc_desc',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	cAnual: {
		field: 'c_anual',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	recorrido: {
		field: 'recorrido',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	planB: {
		field: 'plan_b',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	lzEdesur: {
		field: 'lz_edesur',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	facturarABL: {
		field: 'facturar_abl',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	facturar: {
		field: 'facturar',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	facturarEdesur: {
		field: 'facturar_edesur',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	comuna: {
		field: 'comuna',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	calleEdesur: {
		field: 'calle_edesur',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	numeroEdesur: {
		field: 'numero_edesur',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default EdesurSchema;