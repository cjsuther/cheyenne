import { DataTypes } from 'sequelize';

const PersonaJuridicaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
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
	denominacion: {
		field: 'denominacion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	nombreFantasia: {
		field: 'nombre_fantasia',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idFormaJuridica: {
		field: 'id_forma_juridica',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idJurisdiccion: {
		field: 'id_jurisdiccion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaConstitucion: {
		field: 'fecha_constitucion',
		type: DataTypes.DATE,
		allowNull: false
	},
	mesCierre: {
		field: 'mes_cierre',
		type: DataTypes.INTEGER,
		allowNull: true
	},
	logo: {
		field: 'logo',
		type: DataTypes.TEXT,
		allowNull: true
	}
};

export default PersonaJuridicaSchema;
