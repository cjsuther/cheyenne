import { DataTypes } from 'sequelize';

const VinculoComercioSchema = {
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
	idTipoVinculoComercio: {
		field: 'id_tipo_vinculo_comercio',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idPersona: {
		field: 'id_persona',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoInstrumento: {
		field: 'id_tipo_instrumento',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	fechaInstrumentoDesde: {
		field: 'fecha_instrumento_desde',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaInstrumentoHasta: {
		field: 'fecha_instrumento_hasta',
		type: DataTypes.DATE,
		allowNull: true
	},
	porcentajeCondominio: {
		field: 'porcentaje_condominio',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default VinculoComercioSchema;
