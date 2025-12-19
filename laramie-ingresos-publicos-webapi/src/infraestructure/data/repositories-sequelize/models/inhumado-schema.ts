import { DataTypes } from 'sequelize';

const InhumadoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idCementerio: {
		field: 'id_cementerio',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoDocumento: {
		field: 'id_tipo_documento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroDocumento: {
		field: 'numero_documento',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	apellido: {
		field: 'apellido',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	nombre: {
		field: 'nombre',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	fechaNacimiento: {
		field: 'fecha_nacimiento',
		type: DataTypes.DATE,
		allowNull: true
	},
	idGenero: {
		field: 'id_genero',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idEstadoCivil: {
		field: 'id_estado_civil',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idNacionalidad: {
		field: 'id_nacionalidad',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaDefuncion: {
		field: 'fecha_defuncion',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaIngreso: {
		field: 'fecha_ingreso',
		type: DataTypes.DATE,
		allowNull: true
	},
	idMotivoFallecimiento: {
		field: 'id_motivo_fallecimiento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCocheria: {
		field: 'id_cocheria',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroDefuncion: {
		field: 'numero_defuncion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	libro: {
		field: 'libro',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	folio: {
		field: 'folio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	idRegistroCivil: {
		field: 'id_registro_civil',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	acta: {
		field: 'acta',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	idTipoOrigenInhumacion: {
		field: 'id_tipo_origen_inhumacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	observacionesOrigen: {
		field: 'observaciones_origen',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idTipoCondicionEspecial: {
		field: 'id_tipo_condicion_especial',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaEgreso: {
		field: 'fecha_egreso',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaTraslado: {
		field: 'fecha_traslado',
		type: DataTypes.DATE,
		allowNull: true
	},
	idTipoDestinoInhumacion: {
		field: 'id_tipo_destino_inhumacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	observacionesDestino: {
		field: 'observaciones_destino',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	fechaExhumacion: {
		field: 'fecha_exhumacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaReduccion: {
		field: 'fecha_reduccion',
		type: DataTypes.DATE,
		allowNull: true
	},
	numeroReduccion: {
		field: 'numero_reduccion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	unidad: {
		field: 'unidad',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idTipoDocumentoResponsable: {
		field: 'id_tipo_documento_responsable',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroDocumentoResponsable: {
		field: 'numero_documento_responsable',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	apellidoResponsable: {
		field: 'apellido_responsable',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	nombreResponsable: {
		field: 'nombre_responsable',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	fechaHoraInicioVelatorio: {
		field: 'fecha_hora_inicio_velatorio',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaHoraFinVelatorio: {
		field: 'fecha_hora_fin_velatorio',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default InhumadoSchema;
