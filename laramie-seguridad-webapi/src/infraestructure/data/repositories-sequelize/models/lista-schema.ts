import { DataTypes } from 'sequelize';

const ListaSchema = {
    id: {
        field: 'id',
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    codigo: {
        field: 'codigo',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    tipo: {
        field: 'tipo',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre: {
        field: 'nombre',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    orden: {
        field: 'orden',
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

export default ListaSchema;
