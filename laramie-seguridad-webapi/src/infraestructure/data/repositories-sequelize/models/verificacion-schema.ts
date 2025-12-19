import { DataTypes } from 'sequelize';

const VerificacionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTipoVerificacion: {
		field: 'id_tipo_verificacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEstadoVerificacion: {
		field: 'id_estado_verificacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idUsuario: {
		field: 'id_usuario',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	codigo: {
		field: 'codigo',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	fechaDesde: {
		field: 'fecha_desde',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaHasta: {
		field: 'fecha_hasta',
		type: DataTypes.DATE,
		allowNull: false
	},
	token: {
		field: 'token',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	detalle: {
		field: 'detalle',
		type: DataTypes.STRING(1000),
		allowNull: false
	}
};

export default VerificacionSchema;
