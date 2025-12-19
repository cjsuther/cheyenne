import { DataTypes } from 'sequelize';

const VinculoInmuebleSchema = {
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
	idTipoVinculoInmueble: {
		field: 'id_tipo_vinculo_inmueble',
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

export default VinculoInmuebleSchema;
