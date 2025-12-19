import { DataTypes } from 'sequelize';

const EmisionNumeracionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	nombre: {
		field: 'nombre',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idTipoTributo: {
		field: 'id_tipo_tributo',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	valorProximo: {
		field: 'valor_proximo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	valorReservadoDesde: {
		field: 'valor_reservado_desde',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	valorReservadoHasta: {
		field: 'valor_reservado_hasta',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	idEmisionEjecucionBloqueo: {
		field: 'id_emision_ejecucion_bloqueo',
		type: DataTypes.BIGINT,
		allowNull: true
	}
};

export default EmisionNumeracionSchema;
