import { DataTypes } from 'sequelize';

const ProcesoProgramacionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	entidad: {
		field: 'entidad',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	urlEjecucion: {
		field: 'url_ejecucion',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	idTipoProgramacion: {
		field: 'id_tipo_programacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	diasProgramacion: {
		field: 'dias_programacion',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	fechaUltimaProgramacion: {
		field: 'fecha_ultima_programacion',
		type: DataTypes.DATE,
		allowNull: false
	},
	activa: {
		field: 'activa',
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};

export default ProcesoProgramacionSchema;
