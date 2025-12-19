import { DataTypes } from 'sequelize';

const PerfilSchema = {
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
    }
};

export default PerfilSchema;
