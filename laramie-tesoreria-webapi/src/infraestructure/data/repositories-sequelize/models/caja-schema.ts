import { DataTypes } from 'sequelize';

const CajaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	codigo: {
		field: 'codigo',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	nombre: {
		field: 'nombre',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	orden: {
		field: 'orden',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	idDependencia: {
		field: 'id_dependencia',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEstadoCaja: {
		field: 'id_estado_caja',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idUsuarioActual: {
		field: 'id_usuario_actual',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idCajaAsignacionActual: {
		field: 'id_caja_asignacion_actual',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idRecaudadora: {
		field: 'id_recaudadora',
		type: DataTypes.BIGINT,
		allowNull: false
	},
};

export default CajaSchema;
