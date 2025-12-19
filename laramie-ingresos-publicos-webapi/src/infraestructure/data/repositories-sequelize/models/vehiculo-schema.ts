import { DataTypes } from 'sequelize';

const VehiculoSchema = {
    id: {
        field: 'id',
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    idCuenta: {
        field: 'id_cuenta',
        type: DataTypes.BIGINT,
        allowNull: true
    },
    idEstadoCarga: {
        field: 'id_estado_carga',
        type: DataTypes.BIGINT,
        allowNull: false
    },
    fechaCargaInicio: {
        field: 'fecha_carga_inicio',
        type: DataTypes.DATE,
        allowNull: false
    },
    fechaCargaFin: {
        field: 'fecha_carga_fin',
        type: DataTypes.DATE,
        allowNull: true
    },
	dominio: {
		field: 'dominio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	dominioAnterior: {
		field: 'dominio_anterior',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	anioModelo: {
		field: 'anio_modelo',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	marca: {
		field: 'marca',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	codigoMarca: {
		field: 'codigo_marca',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	modelo: {
		field: 'modelo',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idIncisoVehiculo: {
		field: 'id_inciso_vehiculo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoVehiculo: {
		field: 'id_tipo_vehiculo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCategoriaVehiculo: {
		field: 'id_categoria_vehiculo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroMotor: {
		field: 'numero_motor',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	marcaMotor: {
		field: 'marca_motor',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	numeroChasis: {
		field: 'numero_chasis',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	serieMotor: {
		field: 'serie_motor',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	legajo: {
		field: 'legajo',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	valuacion: {
		field: 'valuacion',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	peso: {
		field: 'peso',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	carga: {
		field: 'carga',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	cilindrada: {
		field: 'cilindrada',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idOrigenFabricacion: {
		field: 'id_origen_fabricacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCombustible: {
		field: 'id_combustible',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idUsoVehiculo: {
		field: 'id_uso_vehiculo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idMotivoBajaVehiculo: {
		field: 'id_motivo_baja_vehiculo',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	recupero: {
		field: 'recupero',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	radicacionAnterior: {
		field: 'radicacion_anterior',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	fechaAlta: {
		field: 'fecha_alta',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaPatentamiento: {
		field: 'fecha_patentamiento',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaRadicacion: {
		field: 'fecha_radicacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaTransferencia: {
		field: 'fecha_transferencia',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaCompra: {
		field: 'fecha_compra',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaBaja: {
		field: 'fecha_baja',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaHabilitacionDesde: {
		field: 'fecha_habilitacion_desde',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaHabilitacionHasta: {
		field: 'fecha_habilitacion_hasta',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaDDJJ: {
		field: 'fecha_ddjj',
		type: DataTypes.DATE,
		allowNull: true
	}    
};

export default VehiculoSchema;
