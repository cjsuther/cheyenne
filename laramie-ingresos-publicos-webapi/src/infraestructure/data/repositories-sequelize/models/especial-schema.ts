import { DataTypes } from 'sequelize';

const EspecialSchema = {
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
    }
};

export default EspecialSchema;
