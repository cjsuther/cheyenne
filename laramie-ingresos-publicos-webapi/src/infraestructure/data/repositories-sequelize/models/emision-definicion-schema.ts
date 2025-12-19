import { DataTypes } from 'sequelize';

const EmisionDefinicionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTipoTributo: {
		field: 'id_tipo_tributo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idNumeracion: {
		field: 'id_numeracion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idProcedimiento: {
		field: 'id_procedimiento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEstadoEmisionDefinicion: {
		field: 'id_estado_emision_definicion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEmisionDefinicionBase: {
		field: 'id_emision_definicion_base',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	numero: {
		field: 'numero',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	codigoDelegacion: {
		field: 'codigo_delegacion',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	periodo: {
		field: 'periodo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	procesaPlanes: {
		field: 'procesa_planes',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	procesaRubros: {
		field: 'procesa_rubros',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	procesaElementos: {
		field: 'procesa_elementos',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	calculoMostradorWeb: {
		field: 'calculo_mostrador_web',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	calculoMasivo: {
		field: 'calculo_masivo',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	calculoPagoAnticipado: {
		field: 'calculo_pago_anticipado',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	fechaReliquidacionDesde: {
		field: 'fecha_reliquidacion_desde',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaReliquidacionHasta: {
		field: 'fecha_reliquidacion_hasta',
		type: DataTypes.DATE,
		allowNull: true
	},
	modulo: {
		field: 'modulo',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default EmisionDefinicionSchema;
