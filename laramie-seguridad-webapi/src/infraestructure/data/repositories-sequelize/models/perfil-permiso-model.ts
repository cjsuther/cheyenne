import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PerfilPermisoSchema from './perfil-permiso-schema';
import PerfilModel from './perfil-model';
import PermisoModel from './permiso-model';

const sequelize = createConnection(true);

class PerfilPermisoModel extends Model {

    getDataValues = () => [
        this.getDataValue("idPermiso"),
        this.getDataValue("idPerfil")
    ];
}

PerfilPermisoModel.init(PerfilPermisoSchema, {
  sequelize,
  modelName: 'PerfilPermiso',
  tableName: 'perfil_permiso',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

PermisoModel.hasMany(PerfilPermisoModel, { as: 'perfilPermiso', foreignKey: 'idPermiso' });
PerfilModel.hasMany(PerfilPermisoModel, { as: 'perfilPermiso', foreignKey: 'idPerfil' });


export default PerfilPermisoModel;