import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PerfilUsuarioSchema from './perfil-usuario-schema';
import PerfilModel from './perfil-model';
import UsuarioModel from './usuario-model';

const sequelize = createConnection(true);

class PerfilUsuarioModel extends Model {

    getDataValues = () => [
      this.getDataValue("idPerfil"),
      this.getDataValue("idUsuario")
    ];

}


PerfilUsuarioModel.init(PerfilUsuarioSchema, {
  sequelize,
  modelName: 'PerfilUsuario',
  tableName: 'perfil_usuario',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

PerfilModel.hasMany(PerfilUsuarioModel, { as: 'perfilUsuario', foreignKey: 'idPerfil' });
UsuarioModel.hasMany(PerfilUsuarioModel, { as: 'perfilUsuario', foreignKey: 'idUsuario' });

export default PerfilUsuarioModel;
