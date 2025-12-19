import { DataTypes } from 'sequelize';

const PerfilPermisoSchema = {
    idPerfil: {
        field: 'id_perfil',
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    idPermiso: {
        field: 'id_permiso',
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    }
};

export default PerfilPermisoSchema; 