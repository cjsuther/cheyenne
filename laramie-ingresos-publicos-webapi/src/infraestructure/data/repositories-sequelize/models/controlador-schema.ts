import { DataTypes } from 'sequelize';

const ControladorSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTipoControlador: {
		field: 'id_tipo_controlador',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	esSupervisor: {
		field: 'es_supervisor',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	fechaAlta: {
		field: 'fecha_alta',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaBaja: {
		field: 'fecha_baja',
		type: DataTypes.DATE,
		allowNull: true
	},
	catastralCir: {
		field: 'catastral_cir',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralSec: {
		field: 'catastral_sec',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralChacra: {
		field: 'catastral_chacra',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralLchacra: {
		field: 'catastral_lchacra',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralQuinta: {
		field: 'catastral_quinta',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralLquinta: {
		field: 'catastral_lquinta',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralFrac: {
		field: 'catastral_frac',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralLfrac: {
		field: 'catastral_lfrac',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralManz: {
		field: 'catastral_manz',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralLmanz: {
		field: 'catastral_lmanz',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralParc: {
		field: 'catastral_parc',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralLparc: {
		field: 'catastral_lparc',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralSubparc: {
		field: 'catastral_subparc',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralUfunc: {
		field: 'catastral_ufunc',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	catastralUcomp: {
		field: 'catastral_ucomp',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	idPersona: {
		field: 'id_persona',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	legajo: {
		field: 'legajo',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idOrdenamiento: {
		field: 'id_ordenamiento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idControladorSupervisor: {
		field: 'id_controlador_supervisor',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	clasificacion: {
		field: 'clasificacion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	fechaUltimaIntimacion: {
		field: 'fecha_ultima_intimacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	cantidadIntimacionesEmitidas: {
		field: 'cantidad_intimaciones_emitidas',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	cantidadIntimacionesAnuales: {
		field: 'cantidad_intimaciones_anuales',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	porcentaje: {
		field: 'porcentaje',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default ControladorSchema;
