import { DataTypes } from 'sequelize';

const EmisionAprobacionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idEmisionEjecucion: {
		field: 'id_emision_ejecucion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEstadoAprobacionCalculo: {
		field: 'id_estado_aprobacion_calculo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idUsuarioAprobacionCalculo: {
		field: 'id_usuario_aprobacion_calculo',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaAprobacionCalculo: {
		field: 'fecha_aprobacion_calculo',
		type: DataTypes.DATE,
		allowNull: true
	},
	idEstadoAprobacionOrdenamiento: {
		field: 'id_estado_aprobacion_ordenamiento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idUsuarioAprobacionOrdenamiento: {
		field: 'id_usuario_aprobacion_ordenamiento',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaAprobacionOrdenamiento: {
		field: 'fecha_aprobacion_ordenamiento',
		type: DataTypes.DATE,
		allowNull: true
	},
	idEstadoAprobacionControlRecibos: {
		field: 'id_estado_aprobacion_control_recibos',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idUsuarioAprobacionControlRecibos: {
		field: 'id_usuario_aprobacion_control_recibos',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaAprobacionControlRecibos: {
		field: 'fecha_aprobacion_control_recibos',
		type: DataTypes.DATE,
		allowNull: true
	},
	idEstadoAprobacionCodigoBarras: {
		field: 'id_estado_aprobacion_codigo_barras',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idUsuarioAprobacionCodigoBarras: {
		field: 'id_usuario_aprobacion_codigo_barras',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaAprobacionCodigoBarras: {
		field: 'fecha_aprobacion_codigo_barras',
		type: DataTypes.DATE,
		allowNull: true
	},
	idEstadoProcesoCuentaCorriente: {
		field: 'id_estado_proceso_cuenta_corriente',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idUsuarioProcesoCuentaCorriente: {
		field: 'id_usuario_proceso_cuenta_corriente',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaProcesoCuentaCorriente: {
		field: 'fecha_proceso_cuenta_corriente',
		type: DataTypes.DATE,
		allowNull: true
	},
	idEstadoProcesoImpresion: {
		field: 'id_estado_proceso_impresion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idUsuarioProcesoImpresion: {
		field: 'id_usuario_proceso_impresion',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaProcesoImpresion: {
		field: 'fecha_proceso_impresion',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default EmisionAprobacionSchema;
