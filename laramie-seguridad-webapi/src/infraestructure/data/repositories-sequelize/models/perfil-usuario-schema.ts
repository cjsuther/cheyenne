import { DataTypes } from 'sequelize';

const PerfilUsuarioSchema = {
    idPerfil: {
        field: 'id_perfil',
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    idUsuario: {
        field: 'id_usuario',
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    }
};

export default PerfilUsuarioSchema;
