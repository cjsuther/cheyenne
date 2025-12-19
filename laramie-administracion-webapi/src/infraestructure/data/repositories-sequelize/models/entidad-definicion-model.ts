import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EntidadDefinicionSchema from './entidad-definicion-schema';

const sequelize = createConnection(true);

class EntidadModel extends Model {

    getDataValues = () => [
        this.getDataValue("id"),
        this.getDataValue("tipo"),
        this.getDataValue("nombre1"),
        this.getDataValue("nombre2"),
        this.getDataValue("nombre3"),
        this.getDataValue("nombre4"),
        this.getDataValue("nombre5"),
        this.getDataValue("nombre6"),
        this.getDataValue("nombre7"),
        this.getDataValue("nombre8"),
        this.getDataValue("nombre9"),
        this.getDataValue("nombre10"),
        this.getDataValue("tipoDato1"),
        this.getDataValue("tipoDato2"),
        this.getDataValue("tipoDato3"),
        this.getDataValue("tipoDato4"),
        this.getDataValue("tipoDato5"),
        this.getDataValue("tipoDato6"),
        this.getDataValue("tipoDato7"),
        this.getDataValue("tipoDato8"),
        this.getDataValue("tipoDato9"),
        this.getDataValue("tipoDato10")
    ];

}

EntidadModel.init(EntidadDefinicionSchema, {
  sequelize,
  modelName: 'EntidadDefinicion',
  tableName: 'entidad_definicion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EntidadModel;
