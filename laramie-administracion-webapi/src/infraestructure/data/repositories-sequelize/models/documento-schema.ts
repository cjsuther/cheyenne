import { DataTypes } from 'sequelize';

const DocumentoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTipoPersona: {
		field: 'id_tipo_persona',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idPersona: {
		field: 'id_persona',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoDocumento: {
		field: 'id_tipo_documento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroDocumento: {
		field: 'numero_documento',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	principal: {
		field: 'principal',
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};

export default DocumentoSchema;
