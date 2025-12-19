import { DataTypes } from 'sequelize';

const CuentaSchema = {
    id: {
        field: 'id',
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    numeroCuenta: {
        field: 'numero_cuenta',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    numeroWeb: {
        field: 'numero_web',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    idEstadoCuenta: {
        field: 'id_estado_cuenta',
        type: DataTypes.BIGINT,
        allowNull: false
    },
    idTipoTributo: {
        field: 'id_tipo_tributo',
        type: DataTypes.BIGINT,
        allowNull: false
    },
    idTributo: {
        field: 'id_tributo',
        type: DataTypes.BIGINT,
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
    idContribuyentePrincipal: {
        field: 'id_contribuyente_principal',
        type: DataTypes.BIGINT,
        allowNull: true
    },
    idDireccionPrincipal: {
        field: 'id_direccion_principal',
        type: DataTypes.BIGINT,
        allowNull: true
    },
    idDireccionEntrega: {
        field: 'id_direccion_entrega',
        type: DataTypes.BIGINT,
        allowNull: true
    }
};

export default CuentaSchema;
