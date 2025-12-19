import { DataTypes } from 'sequelize';

const EtiquetaSchema = {
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
	codigo: {
		field: 'codigo',
		type: DataTypes.STRING(50),
		allowNull: false
	}
};

export default EtiquetaSchema;
