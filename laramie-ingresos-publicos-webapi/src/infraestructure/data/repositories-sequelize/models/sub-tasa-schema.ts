import { DataTypes } from 'sequelize';

const SubTasaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTasa: {
		field: 'id_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	codigo: {
		field: 'codigo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	impuestoNacional: {
		field: 'impuesto_nacional',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	impuestoProvincial: {
		field: 'impuesto_provincial',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	ctasCtes: {
		field: 'ctas_ctes',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	timbradosExtras: {
		field: 'timbrados_extras',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	descripcionReducida: {
		field: 'descripcion_reducida',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	fechaDesde: {
		field: 'fecha_desde',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaHasta: {
		field: 'fecha_hasta',
		type: DataTypes.DATE,
		allowNull: true
	},
	rubroGenerico: {
		field: 'rubro_generico',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	liquidableCtaCte: {
		field: 'liquidable_cta_cte',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	liquidableDDJJ: {
		field: 'liquidable_ddjj',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	actualizacion: {
		field: 'actualizacion',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	accesorios: {
		field: 'accesorios',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	internetDDJJ: {
		field: 'internet_ddjj',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	imputXPorc: {
		field: 'imput_x_porc',
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};

export default SubTasaSchema;
