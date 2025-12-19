import { DataTypes } from 'sequelize';

const SuperficieSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idInmueble: {
		field: 'id_inmueble',
		type: DataTypes.BIGINT,
		allowNull: false
	},	
	nroSuperficie: {
		field: 'nro_superficie',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	nroInterno: {
		field: 'nro_interno',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	nroDeclaracionJurada: {
		field: 'nro_declaracion_jurada',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idTipoSuperficie: {
		field: 'id_tipo_superficie',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	metros: {
		field: 'metros',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	plano: {
		field: 'plano',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idGrupoSuperficie: {
		field: 'id_grupo_superficie',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idTipoObraSuperficie: {
		field: 'id_tipo_obra_superficie',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idDestinoSuperficie: {
		field: 'id_destino_superficie',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaIntimacion: {
		field: 'fecha_intimacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	nroIntimacion: {
		field: 'nro_intimacion',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	nroAnterior: {
		field: 'nro_anterior',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	fechaPresentacion: {
		field: 'fecha_presentacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaVigenteDesde: {
		field: 'fecha_vigente_desde',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaRegistrado: {
		field: 'fecha_registrado',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaPermisoProvisorio: {
		field: 'fecha_permiso_provisorio',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaAprobacion: {
		field: 'fecha_aprobacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	conformeObra: {
		field: 'conforme_obra',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	fechaFinObra: {
		field: 'fecha_fin_obra',
		type: DataTypes.DATE,
		allowNull: true
	},
	ratificacion: {
		field: 'ratificacion',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	derechos: {
		field: 'derechos',
		type: DataTypes.STRING(50),
		allowNull: false
	}
};

export default SuperficieSchema;