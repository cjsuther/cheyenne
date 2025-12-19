import { DataTypes } from 'sequelize';

const EntidadSchema = {
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
    },
    dato1: {
        field: 'dato_1',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    dato2: {
        field: 'dato_2',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    dato3: {
        field: 'dato_3',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    dato4: {
        field: 'dato_4',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    dato5: {
        field: 'dato_5',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    dato6: {
        field: 'dato_6',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    dato7: {
        field: 'dato_7',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    dato8: {
        field: 'dato_8',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    dato9: {
        field: 'dato_9',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    dato10: {
        field: 'dato_10',
        type: DataTypes.STRING(250),
        allowNull: false
    }
};

export default EntidadSchema;
