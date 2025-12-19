import { DataTypes } from 'sequelize';

const DeclaracionJuradaSchema = {
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
	idTipoTributo: {
		field: 'id_tipo_tributo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTributo: {
		field: 'id_tributo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTasa: {
		field: 'id_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasa: {
		field: 'id_sub_tasa',
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
		type: DataTypes.STRING(20),
		allowNull: false
	},
	idTipoDDJJ: {
		field: 'id_tipo_ddjj',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	valorDeclaracion: {
		field: 'valor_declaracion',
		type: DataTypes.DECIMAL(18,2),
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
	}
};

export default DeclaracionJuradaSchema;
