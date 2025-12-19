import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EntidadSchema from './entidad-schema';

const sequelize = createConnection(true);

class EntidadModel extends Model {

    getDataValues = () => [
        this.getDataValue("id"),
        this.getDataValue("codigo"),
        this.getDataValue("tipo"),
        this.getDataValue("nombre"),
        this.getDataValue("orden"),
        this.getDataValue("dato1"),
        this.getDataValue("dato2"),
        this.getDataValue("dato3"),
        this.getDataValue("dato4"),
        this.getDataValue("dato5"),
        this.getDataValue("dato6"),
        this.getDataValue("dato7"),
        this.getDataValue("dato8"),
        this.getDataValue("dato9"),
        this.getDataValue("dato10")
    ];

}

EntidadModel.init(EntidadSchema, {
  sequelize,
  modelName: 'Entidad',
  tableName: 'entidad',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EntidadModel;
