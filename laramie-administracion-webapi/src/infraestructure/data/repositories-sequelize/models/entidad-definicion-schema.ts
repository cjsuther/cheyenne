import { DataTypes } from 'sequelize';

const EntidadSchema = {
    id: {
        field: 'id',
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    tipo: {
        field: 'tipo',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre1: {
        field: 'nombre_1',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre2: {
        field: 'nombre_2',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre3: {
        field: 'nombre_3',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre4: {
        field: 'nombre_4',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre5: {
        field: 'nombre_5',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre6: {
        field: 'nombre_6',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre7: {
        field: 'nombre_7',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre8: {
        field: 'nombre_8',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre9: {
        field: 'nombre_9',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre10: {
        field: 'nombre_10',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    tipoDato1: {
        field: 'tipo_dato_1',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tipoDato2: {
        field: 'tipo_dato_2',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tipoDato3: {
        field: 'tipo_dato_3',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tipoDato4: {
        field: 'tipo_dato_4',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tipoDato5: {
        field: 'tipo_dato_5',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tipoDato6: {
        field: 'tipo_dato_6',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tipoDato7: {
        field: 'tipo_dato_7',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tipoDato8: {
        field: 'tipo_dato_8',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tipoDato9: {
        field: 'tipo_dato_9',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tipoDato10: {
        field: 'tipo_dato_10',
        type: DataTypes.STRING(20),
        allowNull: false
    }
};

export default EntidadSchema;
