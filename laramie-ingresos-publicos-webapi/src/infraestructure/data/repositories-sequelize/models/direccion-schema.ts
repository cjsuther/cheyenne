import { DataTypes } from 'sequelize';

const DireccionSchema = {
    id: {
        field: 'id',
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    entidad: {
        field: 'entidad',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    idEntidad: {
        field: 'id_entidad',
        type: DataTypes.BIGINT,
        allowNull: false
    },
    idTipoGeoreferencia: {
        field: 'id_tipo_georeferencia',
        type: DataTypes.BIGINT,
        allowNull: true
    },
    idPais: {
        field: 'id_pais',
        type: DataTypes.BIGINT,
        allowNull: true
    },
    idProvincia: {
        field: 'id_provincia',
        type: DataTypes.BIGINT,
        allowNull: true
    },
    idLocalidad: {
        field: 'id_localidad',
        type: DataTypes.BIGINT,
        allowNull: true
    },
    idZonaGeoreferencia: {
        field: 'id_zona_georeferencia',
        type: DataTypes.BIGINT,
        allowNull: true
    },
    codigoPostal: {
        field: 'codigo_postal',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    calle: {
        field: 'calle',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    entreCalle1: {
        field: 'entre_calle_1',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    entreCalle2: {
        field: 'entre_calle_2',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    altura: {
        field: 'altura',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    piso: {
        field: 'piso',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    dpto: {
        field: 'dpto',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    referencia: {
        field: 'referencia',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    longitud: {
        field: 'longitud',
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    latitud: {
        field: 'latitud',
        type: DataTypes.DOUBLE,
        allowNull: false
    }
};

export default DireccionSchema;
