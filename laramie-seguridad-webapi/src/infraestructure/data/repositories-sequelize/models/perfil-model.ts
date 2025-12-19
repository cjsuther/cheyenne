import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PerfilSchema from './perfil-schema';

const sequelize = createConnection(true);

class PerfilModel extends Model {

    getDataValues = () => [
        this.getDataValue("id"),
        this.getDataValue("codigo"),
        this.getDataValue("nombre")
    ];

}

PerfilModel.init(PerfilSchema, {
  sequelize,
  modelName: 'Perfil',
  tableName: 'perfil',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default PerfilModel;
