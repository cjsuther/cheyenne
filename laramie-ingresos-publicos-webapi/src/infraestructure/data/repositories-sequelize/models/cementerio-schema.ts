import { DataTypes } from 'sequelize';

const CementerioSchema = {
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
	idTipoConstruccionFuneraria: {
		field: 'id_tipo_construccion_funeraria',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCementerio: {
		field: 'id_cementerio',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	circunscripcionCementerio: {
		field: 'circunscripcion_cementerio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	seccionCementerio: {
		field: 'seccion_cementerio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	manzanaCementerio: {
		field: 'manzana_cementerio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	parcelaCementerio: {
		field: 'parcela_cementerio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	frenteCementerio: {
		field: 'frente_cementerio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	filaCementerio: {
		field: 'fila_cementerio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	numeroCementerio: {
		field: 'numero_cementerio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	fechaAlta: {
		field: 'fecha_alta',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaBaja: {
		field: 'fecha_baja',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaPresentacion: {
		field: 'fecha_presentacion',
		type: DataTypes.DATE,
		allowNull: true
	},
	digitoVerificador: {
		field: 'digito_verificador',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	fechaConcesion: {
		field: 'fecha_concesion',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaEscritura: {
		field: 'fecha_escritura',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaSucesion: {
		field: 'fecha_sucesion',
		type: DataTypes.DATE,
		allowNull: true
	},
	libroEscritura: {
		field: 'libro_escritura',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	folioEscritura: {
		field: 'folio_escritura',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	numeroSucesion: {
		field: 'numero_sucesion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	superficie: {
		field: 'superficie',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	largo: {
		field: 'largo',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	ancho: {
		field: 'ancho',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}    
};

export default CementerioSchema;
