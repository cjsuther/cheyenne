import { DataTypes } from 'sequelize';

const PagoContadoDefinicionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idEstadoPagoContadoDefinicion: {
		field: 'id_estado_pago_contado_definicion',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idTipoPlanPago: {
		field: 'id_tipo_plan_pago',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoTributo: {
		field: 'id_tipo_tributo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTasaPagoContado: {
		field: 'id_tasa_pago_contado',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idSubTasaPagoContado: {
		field: 'id_sub_tasa_pago_contado',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idTasaSellados: {
		field: 'id_tasa_sellados',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idSubTasaSellados: {
		field: 'id_sub_tasa_sellados',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idTasaGastosCausidicos: {
		field: 'id_tasa_gastos_causidicos',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idSubTasaGastosCausidicos: {
		field: 'id_sub_tasa_gastos_causidicos',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	codigo: {
		field: 'codigo',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	fechaDesde: {
		field: 'fecha_desde',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaHasta: {
		field: 'fecha_hasta',
		type: DataTypes.DATE,
		allowNull: true
	},
	idTipoAlcanceTemporal: {
		field: 'id_tipo_alcance_temporal',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaDesdeAlcanceTemporal: {
		field: 'fecha_desde_alcance_temporal',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaHastaAlcanceTemporal: {
		field: 'fecha_hasta_alcance_temporal',
		type: DataTypes.DATE,
		allowNull: true
	},
	mesDesdeAlcanceTemporal: {
		field: 'mes_desde_alcance_temporal',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	mesHastaAlcanceTemporal: {
		field: 'mes_hasta_alcance_temporal',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	aplicaDerechosEspontaneos: {
		field: 'aplica_derechos_espontaneos',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	aplicaTotalidadDeudaAdministrativa: {
		field: 'aplica_totalidad_deuda_administrativa',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	aplicaDeudaAdministrativa: {
		field: 'aplica_deuda_administrativa',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	aplicaDeudaLegal: {
		field: 'aplica_deuda_legal',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	aplicaGranContribuyente: {
		field: 'aplica_gran_contribuyente',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	aplicaPequenioContribuyente: {
		field: 'aplica_pequenio_contribuyente',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	montoDeudaAdministrativaDesde: {
		field: 'monto_deuda_administrativa_desde',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	montoDeudaAdministrativaHasta: {
		field: 'monto_deuda_administrativa_hasta',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	idViaConsolidacion: {
		field: 'id_via_consolidacion',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	porcentajeQuitaRecargos: {
		field: 'porcentaje_quita_recargos',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	porcentajeQuitaMultaInfracciones: {
		field: 'porcentaje_quita_multa_infracciones',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	porcentajeQuitaHonorarios: {
		field: 'porcentaje_quita_honorarios',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	porcentajeQuitaAportes: {
		field: 'porcentaje_quita_aportes',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	idUsuarioCreacion: {
		field: 'id_usuario_creacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaCreacion: {
		field: 'fecha_creacion',
		type: DataTypes.DATE,
		allowNull: false
	}
};

export default PagoContadoDefinicionSchema;
