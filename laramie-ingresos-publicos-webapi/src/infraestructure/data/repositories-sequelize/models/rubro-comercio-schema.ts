import { DataTypes } from 'sequelize';

const RubroComercioSchema = {
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
	 idTipoRubroComercio: {
		field: 'id_tipo_rubro_comercio',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	 idUbicacionComercio: {
		field: 'id_ubicacion_comercio',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	 idRubroLiquidacion: {
		field: 'id_rubro_liquidacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	 idRubroProvincia: {
		field: 'id_rubro_provincia',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	 idRubroBCRA: {
		field: 'id_rubro_bcra',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	 descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	 esDeOficio: {
		field: 'es_de_oficio',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	 esRubroPrincipal: {
		field: 'es_rubro_principal',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	 esConDDJJ: {
		field: 'es_con_ddjj',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	 fechaInicio: {
		field: 'fecha_inicio',
		type: DataTypes.DATE,
		allowNull: true
	},
	 fechaCese: {
		field: 'fecha_cese',
		type: DataTypes.DATE,
		allowNull: true
	},
	 fechaAltaTransitoria: {
		field: 'fecha_alta_transitoria',
		type: DataTypes.DATE,
		allowNull: true
	},
	 fechaBajaTransitoria: {
		field: 'fecha_baja_transitoria',
		type: DataTypes.DATE,
		allowNull: true
	},
	 fechaBaja: {
		field: 'fecha_baja',
		type: DataTypes.DATE,
		allowNull: true
	},
	 idMotivoBajaRubroComercio: {
		field: 'id_motivo_baja_rubro_comercio',
		type: DataTypes.BIGINT,
		allowNull: true
	}
};

export default RubroComercioSchema;
