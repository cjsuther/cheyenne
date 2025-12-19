import { DataTypes } from 'sequelize';

const MensajeSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTipoMensaje: {
		field: 'id_tipo_mensaje',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEstadoMensaje: {
		field: 'id_estado_mensaje',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCanal: {
		field: 'id_canal',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idPrioridad: {
		field: 'id_prioridad',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	identificador: {
		field: 'identificador',
		type: DataTypes.STRING(250),
		allowNull: false,
	},
	titulo: {
		field: 'titulo',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	cuerpo: {
		field: 'cuerpo',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	idUsuarioCreacion: {
		field: 'id_usuario_creacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaCreacion: {
		field: 'fecha_creacion',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaRecepcion: {
		field: 'fecha_recepcion',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaEnvio: {
		field: 'fecha_envio',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default MensajeSchema;
