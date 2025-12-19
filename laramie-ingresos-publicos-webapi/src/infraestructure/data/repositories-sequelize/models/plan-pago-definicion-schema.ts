import { DataTypes } from 'sequelize';

const PlanPagoDefinicionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idEstadoPlanPagoDefinicion: {
		field: 'id_estado_plan_pago_definicion',
		type: DataTypes.BIGINT,
		allowNull: false
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
	idTasaPlanPago: {
		field: 'id_tasa_plan_pago',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idSubTasaPlanPago: {
		field: 'id_sub_tasa_plan_pago',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idTasaInteres: {
		field: 'id_tasa_interes',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idSubTasaInteres: {
		field: 'id_sub_tasa_interes',
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
	tieneAnticipo: {
		field: 'tiene_anticipo',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	cuotaDesde: {
		field: 'cuota_desde',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	cuotaHasta: {
		field: 'cuota_hasta',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	peridiocidad: {
		field: 'peridiocidad',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	idTipoVencimientoAnticipo: {
		field: 'id_tipo_vencimiento_anticipo',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idTipoVencimientoCuota1: {
		field: 'id_tipo_vencimiento_cuota1',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idTipoVencimientoCuotas: {
		field: 'id_tipo_vencimiento_cuotas',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	porcentajeAnticipo: {
		field: 'porcentaje_anticipo',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
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
	aplicaCancelacionAnticipada: {
		field: 'aplica_cancelacion_anticipada',
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
	caducidadAnticipoImpago: {
		field: 'caducidad_anticipo_impago',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	caducidadCantidadCuotasConsecutivas: {
		field: 'caducidad_cantidad_cuotas_consecutivas',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	caducidadCantidadCuotasNoConsecutivas: {
		field: 'caducidad_cantidad_cuotas_no_consecutivas',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	caducidadCantidadDiasVencimiento: {
		field: 'caducidad_cantidad_dias_vencimiento',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	caducidadCantidadDeclaracionesJuradas: {
		field: 'caducidad_cantidad_declaraciones_juradas',
		type: DataTypes.INTEGER,
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
	montoCuotaDesde: {
		field: 'monto_cuota_desde',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	montoCuotaHasta: {
		field: 'monto_cuota_hasta',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	idTipoCalculoInteres: {
		field: 'id_tipo_calculo_interes',
		type: DataTypes.BIGINT,
		allowNull: true
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

export default PlanPagoDefinicionSchema;
