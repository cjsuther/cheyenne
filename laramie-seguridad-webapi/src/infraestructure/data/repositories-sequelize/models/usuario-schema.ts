import { DataTypes } from 'sequelize';

const UsuarioSchema = {
    id: {
        field: 'id',
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    idTipoUsuario: {
        field: 'id_tipo_usuario',
        type: DataTypes.BIGINT,
        allowNull: false
    },
    idEstadoUsuario: {
        field: 'id_estado_usuario',
        type: DataTypes.BIGINT,
        allowNull: false
    },
    idPersona: {
        field: 'id_persona',
        type: DataTypes.BIGINT,
        allowNull: true
    },
    codigo: {
        field: 'codigo',
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombreApellido: {
        field: 'nombre_apellido',
        type: DataTypes.STRING(250),
        allowNull: false
    },
    email: {
        field: 'email',
        type: DataTypes.STRING(250),
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
    }
};

export default UsuarioSchema;
