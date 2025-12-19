import { DataTypes } from 'sequelize';

const ProcedimientoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idEstadoProcedimiento: {
		field: 'id_estado_procedimiento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoTributo: {
		field: 'id_tipo_tributo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	nombre: {
		field: 'nombre',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
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
	}
};

export default ProcedimientoSchema;
