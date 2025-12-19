import { DataTypes } from 'sequelize';

const InspeccionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idComercio: {
		field: 'id_comercio',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	idMotivoInspeccion: {
		field: 'id_motivo_inspeccion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSupervisor: {
		field: 'id_supervisor',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idInspector: {
		field: 'id_inspector',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaInicio: {
		field: 'fecha_inicio',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaFinalizacion: {
		field: 'fecha_finalizacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaNotificacion: {
		field: 'fecha_notificacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaBaja: {
		field: 'fecha_baja',
		type: DataTypes.DATE,
		allowNull: true
	},
	anioDesde: {
		field: 'anio_desde',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	mesDesde: {
		field: 'mes_desde',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	anioHasta: {
		field: 'anio_hasta',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	mesHasta: {
		field: 'mes_hasta',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	numeroResolucion: {
		field: 'numero_resolucion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	letraResolucion: {
		field: 'letra_resolucion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	anioResolucion: {
		field: 'anio_resolucion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	fechaResolucion: {
		field: 'fecha_resolucion',
		type: DataTypes.DATE,
		allowNull: true
	},
	numeroLegajillo: {
		field: 'numero_legajillo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	letraLegajillo: {
		field: 'letra_legajillo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	anioLegajillo: {
		field: 'anio_legajillo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	activo: {
		field: 'activo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	porcentajeMulta: {
		field: 'porcentaje_multa',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	emiteConstancia: {
		field: 'emite_constancia',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	pagaPorcentaje: {
		field: 'paga_porcentaje',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	idExpediente: {
		field: 'id_expediente',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default InspeccionSchema;
