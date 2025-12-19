import { DataTypes } from 'sequelize';

const ObservacionSchema = {
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
	detalle: {
		field: 'detalle',
		type: DataTypes.STRING(1000),
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

export default ObservacionSchema;
