import { DataTypes } from 'sequelize';

const ActoProcesalSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idApremio: {
		field: 'id_apremio',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoActoProcesal: {
		field: 'id_tipo_acto_procesal',
		type: DataTypes.BIGINT,
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
		allowNull: false
	},
	observacion: {
		field: 'observacion',
		type: DataTypes.STRING(1000),
		allowNull: false
	}
};

export default ActoProcesalSchema;
