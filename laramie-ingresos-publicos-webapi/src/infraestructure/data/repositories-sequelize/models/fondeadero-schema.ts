import { DataTypes } from 'sequelize';

const FondeaderoSchema = {
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
	idTasa: {
		field: 'id_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasa: {
		field: 'id_subtasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	embarcacion: {
		field: 'embarcacion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	superficie: {
		field: 'superficie',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	longitud: {
		field: 'longitud',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	codigo: {
		field: 'codigo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	club: {
		field: 'club',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	digitoVerificador: {
		field: 'digito_verificador',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	ubicacion: {
		field: 'ubicacion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	margen: {
		field: 'margen',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	fechaAlta: {
		field: 'fecha_alta',
		type: DataTypes.DATE,
		allowNull: false
	}
};

export default FondeaderoSchema;
