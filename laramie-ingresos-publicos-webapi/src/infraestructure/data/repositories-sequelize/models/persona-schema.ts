import { DataTypes } from 'sequelize';

const PersonaSchema = {
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
		allowNull: true
	},
	nombrePersona: {
		field: 'nombre_persona',
		type: DataTypes.STRING(250),
		allowNull: true
	},
	idTipoDocumento: {
		field: 'id_tipo_documento',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	numeroDocumento: {
		field: 'numero_documento',
		type: DataTypes.STRING(20),
		allowNull: true
	}
};

export default PersonaSchema;
