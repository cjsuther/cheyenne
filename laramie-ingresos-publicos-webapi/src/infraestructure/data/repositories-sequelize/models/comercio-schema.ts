import { DataTypes } from 'sequelize';

const ComercioSchema = {
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
	idRubro: {
		field: 'id_rubro',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuentaInmueble: {
		field: 'id_cuenta_inmueble',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	nombreFantasia: {
		field: 'nombre_fantasia',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	digitoVerificador: {
		field: 'digito_verificador',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	granContribuyente: {
		field: 'gran_contribuyente',
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};

export default ComercioSchema;
