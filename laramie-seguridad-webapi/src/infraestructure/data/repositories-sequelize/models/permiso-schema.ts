import { DataTypes } from 'sequelize';

const PermisoSchema = {
    id: {
        field: 'id',
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    codigo: {
        field: 'codigo',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre: {
        field: 'nombre',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    descripcion: {
        field: 'descripcion',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    sistema: {
        field: 'sistema',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    idModulo: {
        field: 'id_modulo',
        type: DataTypes.BIGINT,
        allowNull: false
    }
};

export default PermisoSchema;