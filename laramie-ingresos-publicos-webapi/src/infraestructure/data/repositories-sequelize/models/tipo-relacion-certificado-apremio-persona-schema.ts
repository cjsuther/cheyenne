import { DataTypes } from 'sequelize';

const TipoRelacionCertificadoApremioPersonaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	codigo: {
		field: 'codigo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idTipoControlador: {
		field: 'id_tipo_controlador',
		type: DataTypes.BIGINT,
		allowNull: true
	}
};

export default TipoRelacionCertificadoApremioPersonaSchema;
