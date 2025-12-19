import { DataTypes } from 'sequelize';

const ProcesoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	identificador: {
		field: 'identificador',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	entidad: {
		field: 'entidad',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idProcesoProgramacion: {
		field: 'id_proceso_programacion',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idEstadoProceso: {
		field: 'id_estado_proceso',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaProceso: {
		field: 'fecha_proceso',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaInicio: {
		field: 'fecha_inicio',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaFin: {
		field: 'fecha_fin',
		type: DataTypes.DATE,
		allowNull: true
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	observacion: {
		field: 'observacion',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	avance: {
		field: 'avance',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	origen: {
		field: 'origen',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idUsuarioCreacion: {
		field: 'id_usuario_creacion',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaCreacion: {
		field: 'fecha_creacion',
		type: DataTypes.DATE,
		allowNull: false
	},
	urlEjecucion: {
		field: 'url_ejecucion',
		type: DataTypes.STRING(1000),
		allowNull: false
	}
};

export default ProcesoSchema;
