import { DataTypes } from 'sequelize';

const ObraInmuebleSchema = {
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
	idTasa: {
		field: 'id_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasa: {
		field: 'id_sub_tasa',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idTipoMovimiento: {
		field: 'id_tipo_movimiento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	cuota: {
		field: 'cuota',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	fechaPrimerVencimiento: {
		field: 'fecha_primer_vencimiento',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaSegundoVencimiento: {
		field: 'fecha_segundo_vencimiento',
		type: DataTypes.DATE,
		allowNull: false
	},
	idExpediente: {
		field: 'id_expediente',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	detalleExpediente: {
		field: 'detalle_expediente',
		type: DataTypes.STRING(250),
		allowNull: true
	},
	idPersona: {
		field: 'id_persona',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaPresentacion: {
		field: 'fecha_presentacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaInspeccion: {
		field: 'fecha_inspeccion',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaAprobacion: {
		field: 'fecha_aprobacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaInicioDesglose: {
		field: 'fecha_inicio_desglose',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaFinDesglose: {
		field: 'fecha_fin_desglose',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaFinObra: {
		field: 'fecha_fin_obra',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaArchivado: {
		field: 'fecha_archivado',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaIntimado: {
		field: 'fecha_intimado',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaVencidoIntimado: {
		field: 'fecha_vencido_intimado',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaMoratoria: {
		field: 'fecha_moratoria',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaVencidoMoratoria: {
		field: 'fecha_vencido_moratoria',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default ObraInmuebleSchema;
