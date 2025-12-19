import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PermisoSchema from './permiso-schema';

const sequelize = createConnection(true);

class PermisoModel extends Model {

    getDataValues = () => [
        this.getDataValue("id"),
        this.getDataValue("codigo"),
        this.getDataValue("nombre"),
        this.getDataValue("descripcion"),
        this.getDataValue("sistema"),
        this.getDataValue("idModulo"),
    ];

}

PermisoModel.init(PermisoSchema, {
  sequelize,
  modelName: 'Permiso',
  tableName: 'permiso',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PermisoModel;