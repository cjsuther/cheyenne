import { DataTypes } from 'sequelize';

const PersonaFisicaSchema = {
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
	idNacionalidad: {
		field: 'id_nacionalidad',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	nombre: {
		field: 'nombre',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	apellido: {
		field: 'apellido',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idGenero: {
		field: 'id_genero',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEstadoCivil: {
		field: 'id_estado_civil',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idNivelEstudio: {
		field: 'id_nivel_estudio',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	profesion: {
		field: 'profesion',
		type: DataTypes.STRING(250),
		allowNull: true
	},
	matricula: {
		field: 'matricula',
		type: DataTypes.STRING(50),
		allowNull: true
	},
	fechaNacimiento: {
		field: 'fecha_nacimiento',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaDefuncion: {
		field: 'fecha_defuncion',
		type: DataTypes.DATE,
		allowNull: true
	},
	discapacidad: {
		field: 'discapacidad',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	idCondicionFiscal: {
		field: 'id_condicion_fiscal',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idIngresosBrutos: {
		field: 'id_ingresos_brutos',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	ganancias: {
		field: 'ganancias',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	pin: {
		field: 'pin',
		type: DataTypes.STRING(20),
		allowNull: true
	},
	foto: {
		field: 'foto',
		type: DataTypes.TEXT,
		allowNull: true
	}
};

export default PersonaFisicaSchema;
