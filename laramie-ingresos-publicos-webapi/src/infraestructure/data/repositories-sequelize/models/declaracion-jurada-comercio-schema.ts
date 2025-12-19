import { DataTypes } from 'sequelize';

const DeclaracionJuradaComercioSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaPresentacionDDJJ: {
		field: 'fecha_presentacion_ddjj',
		type: DataTypes.DATE,
		allowNull: false
	},
	anioDeclaracion: {
		field: 'anio_declaracion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	mesDeclaracion: {
		field: 'mes_declaracion',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	idTipoDDJJ: {
		field: 'id_tipo_ddjj',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaAlta: {
		field: 'fecha_alta',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaBaja: {
		field: 'fecha_baja',
		type: DataTypes.DATE,
		allowNull: true
	},
	resolucion: {
		field: 'resolucion',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	titulares: {
		field: 'titulares',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	dependientes: {
		field: 'dependientes',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	importeExportaciones: {
		field: 'importe_exportaciones',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeTotalPais: {
		field: 'importe_total_pais',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default DeclaracionJuradaComercioSchema;
