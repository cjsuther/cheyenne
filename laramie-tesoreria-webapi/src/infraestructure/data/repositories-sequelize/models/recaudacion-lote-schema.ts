import { DataTypes } from 'sequelize';

const RecaudacionLoteSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	numeroLote: {
		field: 'numero_lote',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	fechaLote: {
		field: 'fecha_lote',
		type: DataTypes.DATE,
		allowNull: false
	},
	casos: {
		field: 'casos',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	idUsuarioProceso: {
		field: 'id_usuario_proceso',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaProceso: {
		field: 'fecha_proceso',
		type: DataTypes.DATE,
		allowNull: false
	},
	idOrigenRecaudacion: {
		field: 'id_origen_recaudacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idRecaudadora: {
		field: 'id_recaudadora',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaAcreditacion: {
		field: 'fecha_acreditacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	idUsuarioControl: {
		field: 'id_usuario_control',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaControl: {
		field: 'fecha_control',
		type: DataTypes.DATE,
		allowNull: true
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
	importeTotal: {
		field: 'importe_total',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeNeto: {
		field: 'importe_neto',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	pathArchivoRecaudacion: {
		field: 'path_archivo_recaudacion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	nombreArchivoRecaudacion: {
		field: 'nombre_archivo_recaudacion',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default RecaudacionLoteSchema;
