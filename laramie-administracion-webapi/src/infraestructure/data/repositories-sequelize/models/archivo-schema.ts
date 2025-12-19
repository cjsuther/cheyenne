import { DataTypes } from 'sequelize';

const ArchivoSchema = {
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
	idEntidad: {
		field: 'id_entidad',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	nombre: {
		field: 'nombre',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	path: {
		field: 'path',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idUsuario: {
		field: 'id_usuario',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fecha: {
		field: 'fecha',
		type: DataTypes.DATE,
		allowNull: false
	}
};

export default ArchivoSchema;
